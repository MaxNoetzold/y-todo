import * as matchers from "@testing-library/jest-dom/matchers";
import { afterEach, expect } from "vitest";
import { cleanup } from "@testing-library/preact";

expect.extend(matchers);

afterEach(() => {
  cleanup();
});
