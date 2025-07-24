import { build } from 'esbuild';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read package.json to get all dependencies
const packageJson = JSON.parse(readFileSync(join(__dirname, 'package.json'), 'utf8'));

// Get all dependencies to mark as external
const dependencies = [
  ...Object.keys(packageJson.dependencies || {}),
  ...Object.keys(packageJson.devDependencies || {}),
  ...Object.keys(packageJson.optionalDependencies || {}),
];

// Node.js built-in modules
const builtins = [
  'assert', 'buffer', 'child_process', 'cluster', 'crypto', 'dgram', 'dns',
  'domain', 'events', 'fs', 'http', 'https', 'net', 'os', 'path', 'punycode',
  'querystring', 'readline', 'stream', 'string_decoder', 'timers', 'tls',
  'tty', 'url', 'util', 'v8', 'vm', 'zlib', 'constants', 'module',
  'async_hooks', 'http2', 'perf_hooks', 'trace_events', 'worker_threads',
  'inspector', 'repl'
];

const external = [...dependencies, ...builtins];

// Plugin to ensure all node_modules are external
const makeAllPackagesExternalPlugin = {
  name: 'make-all-packages-external',
  setup(build) {
    let filter = /^[^.\/]|^\.[^.\/]|^\.\.[^\/]/ // Must not start with "/" or "./" or "../"
    build.onResolve({ filter }, args => ({ path: args.path, external: true }))
  },
}

try {
  await build({
    entryPoints: ['server/index.ts'],
    bundle: true,
    platform: 'node',
    target: 'node18',
    format: 'esm',
    outfile: 'dist/server.js',
    external,
    plugins: [makeAllPackagesExternalPlugin],
    sourcemap: true,
    minify: false,
    treeShaking: false,
    // Ensure we don't bundle packages
    packages: 'external',
    banner: {
      js: `
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
`
    },
    define: {
      'global': 'globalThis',
    },
  });
  
  console.log('✅ Server build completed successfully');
} catch (error) {
  console.error('❌ Server build failed:', error);
  process.exit(1);
}