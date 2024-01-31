// import "@testing-library/jest-dom";
import "@testing-library/jest-dom/vitest";

import { expect, test } from "vitest";
import { render, fireEvent, screen } from "@testing-library/preact";

import { App } from "./app";

test("increments count when button is clicked", () => {
  render(<App />);

  const button = screen.getByText("Increment");

  fireEvent.click(button);
  expect(screen.getByText("Current value: 1")).toBeInTheDocument();
});
