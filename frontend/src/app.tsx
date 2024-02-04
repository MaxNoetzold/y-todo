import { useEffect, useState } from "preact/hooks";
import * as Y from "yjs";
import Loading from "./components/Loading";
import TodoListContainer from "./components/TodoListContainer";

export function App() {
  const [yDoc, setYDoc] = useState<Y.Doc | null>(null);
  /*
    Simplest solution would be to use a Y.Array<string>.
    But I want to make it a bit more complex to have a better testing ground.
    Therefore I will put Y.Maps into the Y.Array.
  */
  const [yTodos, setYTodos] = useState<Y.Array<Y.Map<string>> | null>(null);

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
      const newArray = yDoc.getArray<Y.Map<string>>("todos");
      setYTodos(newArray);

      // TODO: Remove this test code
      const testEntry1 = new Y.Map<string>();
      testEntry1.set("value", "Test Entry 1");
      const testEntry2 = new Y.Map<string>();
      testEntry2.set("value", "Test Entry 2");
      testEntry2.set("checked", "true");
      newArray.push([testEntry1, testEntry2]);
    }
  }, [yDoc]);

  if (!yDoc || !yTodos) {
    return <Loading />;
  }

  return (
    <div className="container mt-2">
      <h1 className="display-4">Y-Todos</h1>
      <TodoListContainer yTodos={yTodos} />
    </div>
  );
}
