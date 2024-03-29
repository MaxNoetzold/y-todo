/*
  The typescript issue I am experiencing here is described at: https://github.com/testing-library/jest-dom/issues/427
  However, I dont know yet how to fix it. Officially it should be fixed however
  "Property xxx does not exist on type 'Assertion<HTMLElement>'." They are added in setupTests.ts but Typescript doesnt know here.
*/

import { describe, expect, test, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/preact";
import userEvent from "@testing-library/user-event";

import * as Y from "yjs";

import { TodoListEntry } from "./TodoListEntry";

function createNewTestEntry(value: string, checked = false) {
  const yDoc = new Y.Doc();
  const yMap = yDoc.getMap<string>("testMap");
  yMap.set("value", value);
  yMap.set("checked", checked ? "true" : "false");

  return yMap;
}

describe("text value", () => {
  test("renders a todo list entry", async () => {
    const testEntry = createNewTestEntry("Test Entry");

    render(<TodoListEntry value={testEntry} handleDelete={vi.fn()} />);

    const entryElement = await screen.findByText("Test Entry");
    expect(entryElement).toBeInTheDocument();
  });

  test("you can edit the value", async () => {
    const testEntry = createNewTestEntry("Test Entry");
    const user = userEvent.setup();

    render(<TodoListEntry value={testEntry} handleDelete={vi.fn()} />);
    const entryElement = screen.getByText("Test Entry");

    // Simulate click
    await user.click(entryElement);

    // Simulate edit
    const inputElement = await screen.findByRole("textbox");
    await user.type(inputElement, " Edited");
    expect(inputElement).toHaveValue("Test Entry Edited");

    // Expect the value to remain the same after blur
    await user.tab();
    expect(screen.getByText("Test Entry Edited")).toBeInTheDocument();
  });

  test("value edits are stored in the ymap", async () => {
    const testEntry = createNewTestEntry("Test Entry");
    const user = userEvent.setup();

    render(<TodoListEntry value={testEntry} handleDelete={vi.fn()} />);
    const entryElement = screen.getByText("Test Entry");

    // Simulate click
    await user.click(entryElement);

    // Simulate edit
    const inputElement = await screen.findByRole("textbox");
    await user.type(inputElement, " Edited");

    // Expect the value to be stored in the ymap
    expect(testEntry.get("value")).toBe("Test Entry Edited");
  });

  test("external value changes are reflected", async () => {
    const testEntry = createNewTestEntry("Test Entry");

    render(<TodoListEntry value={testEntry} handleDelete={vi.fn()} />);

    // Simulate external change
    testEntry.set("value", "Test Entry Changed");

    // Expect the value to change
    expect(await screen.findByText("Test Entry Changed")).toBeInTheDocument();
  });
});

describe("checked value", () => {
  test("renders a checked todo list entry on init", async () => {
    const testEntry = createNewTestEntry("Test Entry", true);

    render(<TodoListEntry value={testEntry} handleDelete={vi.fn()} />);

    // Expect the checkbox to be checked
    const checkboxElement = await screen.findByRole("checkbox", {
      name: 'check "Test Entry"',
    });
    expect(checkboxElement).toBeChecked();

    // Expect the entry to be crossed out
    const entryElement = await screen.findByText("Test Entry");
    expect(entryElement).toHaveStyle({ textDecoration: "line-through" });
  });

  test("renders an unchecked todo list entry on init", async () => {
    const testEntry = createNewTestEntry("Test Entry");

    render(<TodoListEntry value={testEntry} handleDelete={vi.fn()} />);

    // Expect the checkbox to be unchecked
    const checkboxElement = await screen.findByRole("checkbox", {
      name: 'check "Test Entry"',
    });
    expect(checkboxElement).not.toBeChecked();

    // Expect the entry to not be crossed out
    const entryElement = await screen.findByText("Test Entry");
    expect(entryElement).not.toHaveStyle({ textDecoration: "line-through" });
  });

  test("reflects external changes", async () => {
    const testEntry = createNewTestEntry("Test Entry");

    render(<TodoListEntry value={testEntry} handleDelete={vi.fn()} />);

    // Simulate external change to checked
    testEntry.set("checked", "true");

    // Expect the checkbox to be checked
    const checkboxElement = await screen.findByRole("checkbox", {
      name: 'check "Test Entry"',
    });
    expect(checkboxElement).toBeChecked();

    // Expect the entry to be crossed out
    const entryElement = await screen.findByText("Test Entry");
    expect(entryElement).toHaveStyle({ textDecoration: "line-through" });

    // Simulate external change to unchecked
    testEntry.set("checked", "false");

    // Expect the checkbox to be unchecked
    await waitFor(() => {
      expect(checkboxElement).not.toBeChecked();
    });

    // Expect the entry to not be crossed out
    expect(entryElement).not.toHaveStyle({ textDecoration: "line-through" });
  });

  test("changes the checked value in the ymap", async () => {
    const testEntry = createNewTestEntry("Test Entry");
    const user = userEvent.setup();

    render(<TodoListEntry value={testEntry} handleDelete={vi.fn()} />);
    const checkboxElement = await screen.findByRole("checkbox", {
      name: 'check "Test Entry"',
    });

    // Simulate click
    await user.click(checkboxElement);

    // Expect the value to be stored in the ymap
    expect(testEntry.get("checked")).toBe("true");
  });
});

describe("user interaction", () => {
  test("changes mouse pointer on hover", async () => {
    const testEntry = createNewTestEntry("Test Entry");
    const user = userEvent.setup();

    render(<TodoListEntry value={testEntry} handleDelete={vi.fn()} />);
    const entryElement = await screen.findByText("Test Entry");

    // Simulate mouse hover
    await user.hover(entryElement);

    // Check if the cursor has changed
    expect(entryElement).toHaveStyle({ cursor: "pointer" });
  });

  test("changes to an input field on click", async () => {
    const testEntry = createNewTestEntry("Test Entry");
    const user = userEvent.setup();

    render(<TodoListEntry value={testEntry} handleDelete={vi.fn()} />);
    const entryElement = screen.getByText("Test Entry");

    // Simulate click
    await user.click(entryElement);

    // Check if the element has changed to an input field
    const inputElement = await screen.findByRole("textbox");
    expect(inputElement).toHaveValue("Test Entry");
  });

  test("changes back to a div on blur", async () => {
    const testEntry = createNewTestEntry("Test Entry");
    const user = userEvent.setup();

    render(<TodoListEntry value={testEntry} handleDelete={vi.fn()} />);
    const entryElement = screen.getByText("Test Entry");

    // Simulate click
    await user.click(entryElement);

    // Simulate blur
    const inputElement = await screen.findByRole("textbox");
    await user.tab();
    expect(inputElement).not.toBeInTheDocument();
    expect(screen.getByText("Test Entry")).toBeInTheDocument();
  });
  test("delete function is called on button click", async () => {
    const testEntry = createNewTestEntry("Test Entry");
    const user = userEvent.setup();
    const handleDelete = vi.fn();

    render(<TodoListEntry value={testEntry} handleDelete={handleDelete} />);
    const deleteButton = screen.getByRole("button");

    // Simulate click
    await user.click(deleteButton);

    // Expect the delete function to be called
    expect(handleDelete).toHaveBeenCalledTimes(1);
  });
});
