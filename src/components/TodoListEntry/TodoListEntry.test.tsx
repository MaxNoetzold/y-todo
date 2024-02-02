import { expect, test } from "vitest";
import { render, screen } from "@testing-library/preact";
import userEvent from "@testing-library/user-event";

import { TodoListEntry } from "./TodoListEntry";

test("renders a todo list entry", () => {
  render(<TodoListEntry value="Test Entry" />);
  expect(screen.getByText("Test Entry")).toBeInTheDocument();
});
