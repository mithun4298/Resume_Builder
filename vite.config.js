import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
export default defineConfig({
    plugins: [
        react(),
        runtimeErrorOverlay(),
        ...(process.env.NODE_ENV !== "production" &&
            process.env.REPL_ID !== undefined
            ? [
                await import("@replit/vite-plugin-cartographer").then((m) => m.cartographer()),
            ]
            : []),
    ],
    resolve: {
        alias: {
            "@": path.resolve(import.meta.dirname, "./client/src"),
            "@shared": path.resolve(import.meta.dirname, "./shared"),
            "@assets": path.resolve(import.meta.dirname, "attached_assets"),
        },
    },
    root: path.resolve(import.meta.dirname, "./client"),
    build: {
        outDir: path.resolve(import.meta.dirname, "./dist/client"),
        emptyOutDir: true,
        sourcemap: true,
        rollupOptions: {
            input: path.resolve(import.meta.dirname, "./client/index.html"),
        },
    },
    server: {
        fs: {
            strict: false,
            allow: ['..'],
        },
        proxy: {
            '/api': {
                target: 'http://localhost:3000',
                changeOrigin: true,
            },
        },
    },
});
//# sourceMappingURL=vite.config.js.map