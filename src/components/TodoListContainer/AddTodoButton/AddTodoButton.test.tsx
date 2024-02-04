import { expect, test, describe } from "vitest";
import { render, screen } from "@testing-library/preact";
import userEvent from "@testing-library/user-event";

import * as Y from "yjs";
import { AddTodoButton } from "./AddTodoButton";

describe("one can add a new todo entry to the yjs array", () => {
  test("by clicking the add button", async () => {
    const user = userEvent.setup();

    const ydoc = new Y.Doc();
    const yArray = ydoc.getArray<Y.Map<string>>("todos");

    render(<AddTodoButton yTodos={yArray} />);
    const input = screen.getByPlaceholderText("New Todo");
    await user.type(input, "New Entry");
    await user.click(screen.getByText("Add Todo"));
    expect(yArray.length).toBe(1);
    expect(yArray.get(0).get("value")).toBe("New Entry");
  });

  test("by pressing enter", async () => {
    const user = userEvent.setup();

    const ydoc = new Y.Doc();
    const yArray = ydoc.getArray<Y.Map<string>>("todos");

    render(<AddTodoButton yTodos={yArray} />);
    const input = screen.getByPlaceholderText("New Todo");
    await user.type(input, "New Entry{enter}");
    expect(yArray.length).toBe(1);
    expect(yArray.get(0).get("value")).toBe("New Entry");
  });
});

test("input field is cleared after adding todo", async () => {
  const user = userEvent.setup();

  const ydoc = new Y.Doc();
  const yArray = ydoc.getArray<Y.Map<string>>("todos");

  render(<AddTodoButton yTodos={yArray} />);
  const input = screen.getByPlaceholderText("New Todo");
  await user.type(input, "New Entry");
  await user.click(screen.getByText("Add Todo"));
  expect(input).toHaveValue("");
});
