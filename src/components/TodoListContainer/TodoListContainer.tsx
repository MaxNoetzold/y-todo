import { useEffect, useState } from "preact/hooks";
import AddTodoButton from "./AddTodoButton";
import TodoListEntry from "./TodoListEntry";
import * as Y from "yjs";

type TodoListContainerProps = {
  yTodos: Y.Array<Y.Map<string>>;
};

export function TodoListContainer({ yTodos }: TodoListContainerProps) {
  const [allTodos, setAllTodos] = useState<Y.Map<string>[]>([]);

  // Listen to changes in the Yjs array and update the state
  useEffect(() => {
    const updateTodos = () => {
      setAllTodos(yTodos.toArray());
    };
    yTodos.observe(updateTodos);

    // init value
    setAllTodos(yTodos.toArray());

    return () => {
      yTodos.unobserve(updateTodos);
    };
  }, [yTodos]);

  return (
    <div className="container">
      <ul className="list-group mb-3">
        {allTodos.map((todo, index) => (
          <li className="list-group-item" key={index}>
            <TodoListEntry value={todo} />
          </li>
        ))}
      </ul>
      <AddTodoButton yTodos={yTodos} />
    </div>
  );
}
