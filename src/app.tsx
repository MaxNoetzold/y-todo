import { useEffect, useState } from "preact/hooks";
import TodoListEntry from "./components/TodoListEntry";
import * as Y from "yjs";
import Loading from "./components/Loading";
import { TodoListContainer } from "./components/TodoListContainer/TodoListContainer";

export function App() {
  const [yDoc, setYDoc] = useState<Y.Doc | null>(null);
  const [yTodos, setYTodos] = useState<Y.Array<string> | null>(null);

  // initialize Yjs document
  useEffect(() => {
    const newDoc = new Y.Doc();
    setYDoc(newDoc);

    return () => {
      newDoc.destroy();
    };
  }, []);

  // initialize Yjs array
  useEffect(() => {
    if (yDoc) {
      const newArray = yDoc.getArray<string>("todos");
      setYTodos(newArray);
    }
  }, [yDoc]);

  if (!yDoc || !yTodos) {
    return <Loading />;
  }

  return <TodoListContainer yTodos={yTodos} />;
}
