import path from "path";
import { nanoid } from "nanoid";
import { createServer as createViteServer, createLogger } from "vite";
import express, { type Express } from "express";
import { type Server } from "http";
import fs from "fs";

const viteLogger = createLogger();

export function log(message: string, source = "express") {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`[${timestamp}] [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  const viteConfig = await import("../vite.config.js").catch(() => ({ default: {} }));
  
  const serverOptions = {
    middlewareMode: true as const,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig.default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html",
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(import.meta.dirname, "..", "dist", "client");
  app.use(express.static(distPath));
  
  app.get("*", (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}