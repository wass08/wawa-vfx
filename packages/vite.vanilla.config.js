import { defineConfig } from "vite";
import dtsPlugin from "vite-plugin-dts";

// Separate config for vanilla build
export default defineConfig({
  plugins: [
    dtsPlugin({
      insertTypesEntry: false,
      rollupTypes: true,
      outDir: "dist",
      entryRoot: "src",
      include: ["src/vanilla.ts", "src/components/vfxs/core/**/*", "src/components/vfxs/VFXStore.ts", "src/components/vfxs/types.ts", "src/components/vfxs/easings.ts"]
    }),
  ],
  build: {
    emptyOutDir: false, // Don't clear dist folder
    lib: {
      entry: "src/vanilla.ts",
      name: "WawaVFXVanilla",
      fileName: (format) => `vanilla.${format}.js`,
    },
    rollupOptions: {
      external: ["three"], // Only externalize Three.js for vanilla
      output: {
        globals: {
          three: "THREE",
        },
      },
    },
  },
});