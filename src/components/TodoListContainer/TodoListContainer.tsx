import TodoListEntry from "./TodoListEntry";
import * as Y from "yjs";

type TodoListContainerProps = {
  yTodos: Y.Array<Y.Map<string>>;
};

export function TodoListContainer({ yTodos }: TodoListContainerProps) {
  return (
    <div className="container">
      {yTodos.map((todo, index) => (
        <TodoListEntry key={index} value={todo} />
      ))}
    </div>
  );
}
