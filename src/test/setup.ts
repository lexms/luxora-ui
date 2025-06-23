import "@testing-library/jest-dom";
import { afterAll, beforeAll } from "vitest";

// Suppress React warnings for testing
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === "string" &&
      (args[0].includes("ReactDOMTestUtils.act") ||
        args[0].includes("Warning: An update to"))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
