// test/setup.ts
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

beforeAll(() => {
  // Mocking the logger module
  vi.mock("@/lib/logger", () => {
    return {
      logger: {
        info: vi.fn(),
        error: vi.fn(),
        debug: vi.fn(),
      },
    };
  });
});

// Automatically clean up after each test run
afterEach(() => {
  cleanup();
});
