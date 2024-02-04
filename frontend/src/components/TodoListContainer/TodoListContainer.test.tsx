import { expect, test } from "vitest";
import { render, screen } from "@testing-library/preact";

import * as Y from "yjs";

import { TodoListContainer } from "./TodoListContainer";
import userEvent from "@testing-library/user-event";

test("renders initial todo entries", () => {
  const ydoc = new Y.Doc();
  const yArray = ydoc.getArray<Y.Map<string>>("todos");

  const testEntry1 = new Y.Map<string>();
  testEntry1.set("value", "Test Entry 1");
  const testEntry2 = new Y.Map<string>();
  testEntry2.set("value", "Test Entry 2");

  yArray.push([testEntry1, testEntry2]);

  render(<TodoListContainer yTodos={yArray} />);
  expect(screen.getByText("Test Entry 1")).toBeInTheDocument();
  expect(screen.getByText("Test Entry 2")).toBeInTheDocument();
});

test("displays a new todo entry", async () => {
  const ydoc = new Y.Doc();
  const yArray = ydoc.getArray<Y.Map<string>>("todos");

  render(<TodoListContainer yTodos={yArray} />);

  const testEntry1 = new Y.Map<string>();
  testEntry1.set("value", "Test Entry 1");

  yArray.push([testEntry1]);

  expect(await screen.findByText("Test Entry 1")).toBeInTheDocument();
});

test("deletes a todo entry", async () => {
  const user = userEvent.setup();

  const ydoc = new Y.Doc();
  const yArray = ydoc.getArray<Y.Map<string>>("todos");

  const testEntry1 = new Y.Map<string>();
  testEntry1.set("value", "Test Entry 1");
  const testEntry2 = new Y.Map<string>();
  testEntry2.set("value", "Test Entry 2");

  yArray.push([testEntry1, testEntry2]);

  render(<TodoListContainer yTodos={yArray} />);

  const deleteButton = await screen.findByRole("button", {
    name: 'delete "Test Entry 1"',
  });
  // const deleteButton = await screen.findByLabelText("delete todo entry");
  expect(deleteButton).toBeInTheDocument();

  await user.click(deleteButton);

  expect(screen.queryByText("Test Entry 1")).toBeNull();
  expect(screen.getByText("Test Entry 2")).toBeInTheDocument();
});
