import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: "src/index.js",
      name: "Wawa-VFX",
      fileName: (format) => `wawa-vfx.${format}.js`,
    },
    rollupOptions: {
      external: ["react", "@react-three/fiber", "three"], // Don't bundle these
      output: {
        globals: {
          react: "React",
          "@react-three/fiber": "reactThreeFiber",
          three: "THREE",
        },
      },
    },
  },
});
