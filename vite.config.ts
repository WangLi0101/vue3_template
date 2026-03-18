import { fileURLToPath, URL } from "node:url";
import vue from "@vitejs/plugin-vue";
import { defineConfig, loadEnv } from "vite";
import { viteMockServe } from "vite-plugin-mock";

const DEFAULT_ASSET_DIR = "assets";

const assetDirectoryMap: Record<string, string> = {
  css: "css",
  png: "img",
  jpg: "img",
  jpeg: "img",
  gif: "img",
  svg: "img",
  webp: "img",
  avif: "img",
  ico: "img",
  woff: "fonts",
  woff2: "fonts",
  eot: "fonts",
  ttf: "fonts",
  otf: "fonts",
};

const vendorChunkGroups = [
  { chunkName: "vue-vendor", packages: ["vue", "vue-router", "pinia"] },
  { chunkName: "element-plus", packages: ["element-plus"] },
  { chunkName: "axios", packages: ["axios"] },
] as const;

function resolveManualChunk(id: string): string | undefined {
  if (!id.includes("node_modules")) {
    return undefined;
  }

  for (const { chunkName, packages } of vendorChunkGroups) {
    const matchesPackage = packages.some((pkg) => {
      return id.includes(`/node_modules/${pkg}/`) || id.includes(`\\node_modules\\${pkg}\\`);
    });

    if (matchesPackage) {
      return chunkName;
    }
  }

  return undefined;
}

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const isServe = command === "serve";
  const isDevelopment = mode === "development";
  const isProduction = mode === "production";
  const enableMock = isServe && env.VITE_ENABLE_MOCK !== "false";

  return {
    plugins: [
      vue(),
      viteMockServe({
        mockPath: "mock",
        enable: enableMock,
        logger: enableMock,
      }),
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/styles/variables.scss" as *;',
        },
      },
    },
    build: {
      sourcemap: isDevelopment,
      reportCompressedSize: isProduction,
      chunkSizeWarningLimit: 1000,
      rolldownOptions: {
        output: {
          entryFileNames: "js/[name]-[hash].js",
          chunkFileNames: "js/[name]-[hash].js",
          assetFileNames(assetInfo) {
            const extension = assetInfo.name?.split(".").pop()?.toLowerCase();
            const directory = extension
              ? (assetDirectoryMap[extension] ?? DEFAULT_ASSET_DIR)
              : DEFAULT_ASSET_DIR;

            return `${directory}/[name]-[hash][extname]`;
          },
          manualChunks: resolveManualChunk,
        },
      },
    },
  };
});
