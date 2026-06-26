import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  rmSync,
  statSync,
} from "node:fs";
import { join } from "node:path";
import { fileURLToPath, URL } from "node:url";

import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

function copyDirectory(source, target) {
  mkdirSync(target, { recursive: true });

  for (const entry of readdirSync(source)) {
    const sourcePath = join(source, entry);
    const targetPath = join(target, entry);

    if (statSync(sourcePath).isDirectory()) {
      copyDirectory(sourcePath, targetPath);
    } else {
      copyFileSync(sourcePath, targetPath);
    }
  }
}

function copyStaticImagesPlugin() {
  return {
    name: "copy-static-images-to-assets-dir",
    closeBundle() {
      const source = fileURLToPath(new URL("./static/images", import.meta.url));
      const target = fileURLToPath(
        new URL("./dist/staticOfDuDao/images", import.meta.url),
      );
      const legacyTarget = fileURLToPath(
        new URL("./dist/images", import.meta.url),
      );

      if (existsSync(source)) {
        copyDirectory(source, target);
      }

      if (existsSync(legacyTarget)) {
        rmSync(legacyTarget, { recursive: true, force: true });
      }
    },
  };
}

export default defineConfig({
  base: "./",
  plugins: [vue(), copyStaticImagesPlugin()],
  publicDir: false,
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    host: "localhost",
    port: 8080,
    proxy: {
      "/api": {
        target: "http://125.67.190.126:51000/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  build: {
    assetsDir: "staticOfDuDao",
    chunkSizeWarningLimit: 900,
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        passes: 2,
      },
      format: {
        comments: false,
      },
    },
    rolldownOptions: {
      onwarn(warning, warn) {
        if (warning.code === "PLUGIN_TIMINGS") {
          return;
        }

        if (
          warning.code === "INVALID_ANNOTATION" &&
          warning.loc?.file?.includes("@vueuse/core")
        ) {
          return;
        }

        warn(warning);
      },
      output: {
        codeSplitting: {
          groups: [
            {
              name: "vue-vendor",
              test: /[\\/]node_modules[\\/](vue|vue-router|pinia)[\\/]/,
            },
            {
              name: "element-icons",
              test: /[\\/]node_modules[\\/]@element-plus[\\/]icons-vue[\\/]/,
            },
            {
              name: "vueuse",
              test: /[\\/]node_modules[\\/]@vueuse[\\/]/,
            },
            {
              name: "excel",
              test: /[\\/]node_modules[\\/](vue-json-excel3|xlsx)[\\/]/,
            },
            {
              name: "element-plus",
              test: /[\\/]node_modules[\\/]element-plus[\\/]/,
            },
            {
              name: "maps",
              test: /[\\/]node_modules[\\/](@vuemap)[\\/]/,
            },
            {
              name: "vendor",
              test: /[\\/]node_modules[\\/]/,
            },
          ],
        },
      },
    },
  },
});
