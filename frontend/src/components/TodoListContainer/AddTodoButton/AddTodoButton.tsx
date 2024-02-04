import { useState } from "preact/hooks";
import * as Y from "yjs";

type AddTodoButtonProps = {
  yTodos: Y.Array<Y.Map<string>>;
};

export function AddTodoButton({ yTodos }: AddTodoButtonProps) {
  const [newValue, setNewValue] = useState("");

  const handleAdd = () => {
    const newTodo = new Y.Map<string>();
    newTodo.set("value", newValue);
    yTodos.push([newTodo]);
    setNewValue("");
  };

  const handleInputChange = (event: InputEvent) => {
    if (event.target instanceof HTMLInputElement) {
      setNewValue(event.target.value);
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      handleAdd();
    }
  };

  return (
    <div className="input-group mb-3">
      <input
        type="text"
        className="form-control"
        placeholder="New Todo"
        value={newValue}
        onInput={handleInputChange}
        onKeyDown={handleKeyDown}
      />
      <div className="input-group-append">
        <button className="btn btn-primary" onClick={handleAdd}>
          Add Todo
        </button>
      </div>
    </div>
  );
}
