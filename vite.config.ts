import { fileURLToPath, URL } from "node:url";
import vue from "@vitejs/plugin-vue";
import Icons from "unplugin-icons/vite";
import { defineConfig } from "vite";
import { viteMockServe } from "vite-plugin-mock";

export default defineConfig({
  plugins: [
    vue(),
    viteMockServe({
      mockPath: "mock",
      enable: true,
      logger: true,
    }),
    Icons({
      compiler: "vue3",
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
    rollupOptions: {
      output: {
        chunkFileNames: "static/js/[name]-[hash].js",
        entryFileNames: "static/js/[name]-[hash].js",
        assetFileNames: "static/[ext]/[name]-[hash].[ext]",
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (id.includes("@element-plus/icons-vue"))
            return "element-plus-icons";
          if (id.includes("element-plus")) return "element-plus";
          if (id.includes("@iconify")) return "iconify";
          if (id.includes("vue-router")) return "vue-vendor";
          if (id.includes("pinia")) return "vue-vendor";
          if (id.includes("/vue/")) return "vue-vendor";
          if (id.includes("/@vue/")) return "vue-vendor";
          if (id.includes("axios")) return "axios";
          if (id.includes("nprogress")) return "nprogress";

          return "vendor";
        },
      },
    },
  },
});
