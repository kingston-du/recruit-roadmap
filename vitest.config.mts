import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.tsx"],
    include: ["tests/unit/**/*.test.ts", "tests/integration/**/*.test.{ts,tsx}"],
    restoreMocks: true,
    clearMocks: true,
  },
});
