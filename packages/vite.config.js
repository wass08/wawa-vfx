import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import dtsPlugin from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dtsPlugin({
      insertTypesEntry: true,
      rollupTypes: true,
    }),
  ],
  build: {
    lib: {
      entry: "src/index.ts",
      name: "Wawa-VFX",
      fileName: (format) => `wawa-vfx.${format}.js`,
    },
    rollupOptions: {
      external: [
        "react",
        "react/jsx-runtime",
        "react-dom",
        "react-dom/client",
        "@react-three/fiber",
        "three",
      ], // Don't bundle these
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react-dom/client": "ReactDOMClient",
          "react/jsx-runtime": "react/jsx-runtime",
          "@react-three/fiber": "reactThreeFiber",
          three: "THREE",
        },
      },
    },
  },
});
