import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { resolve } from "path";

export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true,
      rollupTypes: true,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "WawaVFXVanilla",
      formats: ["es", "umd"],
      fileName: (format) => `index.${format === "es" ? "es" : "umd"}.js`,
    },
    rollupOptions: {
      external: ["three", "zustand"],
      output: {
        globals: {
          three: "THREE",
          zustand: "zustand",
        },
      },
    },
  },
});