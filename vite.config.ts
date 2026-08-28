import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import checker from "vite-plugin-checker";
import glsl from "vite-plugin-glsl";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    glsl({
      root: "/"
    }),
    checker({
      typescript: true,
      eslint: {
        lintCommand: "eslint ."
      }
    })
  ],
  // base: process.env.NODE_ENV === 'production' ? '/3d-experiments/' : './'
  base: "/3d-experiments/",
  assetsInclude: [],
  resolve: {
    tsconfigPaths: true
  }
});
