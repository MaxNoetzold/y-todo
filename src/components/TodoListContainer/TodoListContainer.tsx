import { useState } from "preact/hooks";
import TodoListEntry from "../TodoListEntry";

export function TodoListContainer() {
  const [todos, setTodos] = useState<string[]>([]);

  return (
    <div className="container">
      {todos.map((todo, index) => (
        <div key={index}>
          <TodoListEntry value={todo} />
        </div>
      ))}
    </div>
  );
}
