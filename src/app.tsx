import { useEffect, useState } from "preact/hooks";
import TodoListEntry from "./components/TodoListEntry";
import * as Y from "yjs";
import Loading from "./components/Loading";

export function App() {
  const [yDoc, setYDoc] = useState<Y.Doc | null>(null);

  // initialize Yjs document
  useEffect(() => {
    const newDoc = new Y.Doc();
    setYDoc(newDoc);

    return () => {
      newDoc.destroy();
    };
  }, []);

  if (!yDoc) {
    return <Loading />;
  }

  return <TodoListEntry value="Test Entry" />;
}
