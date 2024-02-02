/// <reference types="vitest" />
import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import eslint from "vite-plugin-eslint";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact(), eslint()],
  test: {
    environment: "happy-dom",
    setupFiles: ["./setupTests.ts"],
    includeSource: ["src/**/*.{ts,tsx}"],
    mockReset: true,
    restoreMocks: true,
  },
});
