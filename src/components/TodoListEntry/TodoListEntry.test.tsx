import { expect, test } from "vitest";
import { render, screen } from "@testing-library/preact";
import userEvent from "@testing-library/user-event";

import { TodoListEntry } from "./TodoListEntry";

test("renders a todo list entry", () => {
  render(<TodoListEntry value="Test Entry" />);
  expect(screen.getByText("Test Entry")).toBeInTheDocument();
});

test("changes mouse pointer on hover", async () => {
  const user = userEvent.setup();

  render(<TodoListEntry value="Test Entry" />);
  const entryElement = screen.getByText("Test Entry");

  // Simulate mouse hover
  await user.hover(entryElement);

  // Check if the cursor has changed
  expect(entryElement).toHaveStyle({ cursor: "pointer" });
});

test("changes to an input field on click", async () => {
  render(<TodoListEntry value="Test Entry" />);
  const entryElement = screen.getByText("Test Entry");

  // Simulate click
  await userEvent.click(entryElement);

  // Check if the element has changed to an input field
  const inputElement = await screen.findByRole("textbox");
  expect(inputElement).toHaveValue("Test Entry");
});

test("changes back to a div on blur", async () => {
  render(<TodoListEntry value="Test Entry" />);
  const entryElement = screen.getByText("Test Entry");

  // Simulate click
  await userEvent.click(entryElement);

  // Simulate blur
  const inputElement = await screen.findByRole("textbox");
  await userEvent.tab();
  expect(inputElement).not.toBeInTheDocument();
  expect(screen.getByText("Test Entry")).toBeInTheDocument();
});

test("you can edit the value", async () => {
  render(<TodoListEntry value="Test Entry" />);
  const entryElement = screen.getByText("Test Entry");

  // Simulate click
  await userEvent.click(entryElement);

  // Simulate edit
  const inputElement = await screen.findByRole("textbox");
  await userEvent.type(inputElement, " Edited");
  expect(inputElement).toHaveValue("Test Entry Edited");
});
