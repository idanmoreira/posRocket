import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export const viteConfig = defineConfig({
  plugins: [react()],
});

export default viteConfig;
