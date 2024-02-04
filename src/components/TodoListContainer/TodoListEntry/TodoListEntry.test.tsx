/*
  The typescript issue I am experiencing here is described at: https://github.com/testing-library/jest-dom/issues/427
  However, I dont know yet how to fix it. Officially it should be fixed however
  "Property xxx does not exist on type 'Assertion<HTMLElement>'." They are added in setupTests.ts but Typescript doesnt know here.
*/

import { expect, test } from "vitest";
import { render, screen } from "@testing-library/preact";
import userEvent from "@testing-library/user-event";

import * as Y from "yjs";

import { TodoListEntry } from "./TodoListEntry";

function createNewTestEntry(value: string) {
  const yDoc = new Y.Doc();
  const yMap = yDoc.getMap<string>("testMap");
  yMap.set("value", value);

  return yMap;
}

test("renders a todo list entry", async () => {
  const testEntry = createNewTestEntry("Test Entry");

  render(<TodoListEntry value={testEntry} />);

  const entryElement = await screen.findByText("Test Entry");
  expect(entryElement).toBeInTheDocument();
});

test("changes mouse pointer on hover", async () => {
  const testEntry = createNewTestEntry("Test Entry");

  const user = userEvent.setup();

  render(<TodoListEntry value={testEntry} />);
  const entryElement = await screen.findByText("Test Entry");

  // Simulate mouse hover
  await user.hover(entryElement);

  // Check if the cursor has changed
  expect(entryElement).toHaveStyle({ cursor: "pointer" });
});

test("changes to an input field on click", async () => {
  const testEntry = createNewTestEntry("Test Entry");

  render(<TodoListEntry value={testEntry} />);
  const entryElement = screen.getByText("Test Entry");

  // Simulate click
  await userEvent.click(entryElement);

  // Check if the element has changed to an input field
  const inputElement = await screen.findByRole("textbox");
  expect(inputElement).toHaveValue("Test Entry");
});

test("changes back to a div on blur", async () => {
  const testEntry = createNewTestEntry("Test Entry");

  render(<TodoListEntry value={testEntry} />);
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
  const testEntry = createNewTestEntry("Test Entry");

  render(<TodoListEntry value={testEntry} />);
  const entryElement = screen.getByText("Test Entry");

  // Simulate click
  await userEvent.click(entryElement);

  // Simulate edit
  const inputElement = await screen.findByRole("textbox");
  await userEvent.type(inputElement, " Edited");
  expect(inputElement).toHaveValue("Test Entry Edited");

  // Expect the value to remain the same after blur
  await userEvent.tab();
  expect(screen.getByText("Test Entry Edited")).toBeInTheDocument();
});

test("value edits are stored in the ymap", async () => {
  const testEntry = createNewTestEntry("Test Entry");

  render(<TodoListEntry value={testEntry} />);
  const entryElement = screen.getByText("Test Entry");

  // Simulate click
  await userEvent.click(entryElement);

  // Simulate edit
  const inputElement = await screen.findByRole("textbox");
  await userEvent.type(inputElement, " Edited");

  // Expect the value to be stored in the ymap
  expect(testEntry.get("value")).toBe("Test Entry Edited");
});

test("external changes are reflected", async () => {
  const testEntry = createNewTestEntry("Test Entry");

  render(<TodoListEntry value={testEntry} />);
  const entryElement = screen.getByText("Test Entry");

  // Simulate external change
  testEntry.set("value", "Test Entry Changed");

  // Expect the value to change
  expect(await screen.findByText("Test Entry Changed")).toBeInTheDocument();
});
