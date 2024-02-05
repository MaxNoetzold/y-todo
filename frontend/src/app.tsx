import { useEffect, useState } from "preact/hooks";
import * as Y from "yjs";
import Loading from "./components/Loading";
import TodoListContainer from "./components/TodoListContainer";
import { WebsocketProvider } from "y-websocket";

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

  // initialize y-websocket provider
  useEffect(() => {
    if (yDoc) {
      const wsProvider = new WebsocketProvider(
        import.meta.env.VITE_WEBSOCKET_SERVER,
        import.meta.env.VITE_WEBSOCKET_ROOM,
        yDoc
      );
      wsProvider.on("status", (event: any) => {
        console.debug("y-websocket status:", event.status);
      });

      return () => {
        wsProvider.destroy();
      };
    }
  }, [yDoc]);

  // initialize Yjs array
  useEffect(() => {
    if (yDoc) {
      const newArray = yDoc.getArray<Y.Map<string>>("todos");
      setYTodos(newArray);
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
