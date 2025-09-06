import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { resolve } from "path";

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      rollupTypes: true,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "WawaVFX",
      formats: ["es", "umd"],
      fileName: (format) => `index.${format === "es" ? "es" : "umd"}.js`,
    },
    rollupOptions: {
      external: ["react", "react-dom", "three", "@react-three/fiber", "leva", "zustand", "wawa-vfx-vanilla"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          three: "THREE",
          "@react-three/fiber": "ReactThreeFiber",
          leva: "Leva",
          zustand: "zustand",
          "wawa-vfx-vanilla": "WawaVFXVanilla",
        },
      },
    },
  },
});