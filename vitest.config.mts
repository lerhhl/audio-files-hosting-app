import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: "jsdom",
    globals: true, // To use `describe`, `it`, `expect` without importing them
    setupFiles: ["./test/setup.ts"], // Optional: Path to setup file for global configurations
    coverage: {
      enabled: true,
      reporter: ["text", "json-summary", "json", "html"],
      provider: "v8",
      exclude: ["**/**.js"],
    },
    watch: false,
    include: ["./src/__tests__/**/*.test.ts"],
  },
});
