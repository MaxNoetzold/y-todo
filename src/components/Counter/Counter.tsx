import { useState } from "preact/hooks";

export function Counter() {
  const [count, setCount] = useState(0);
  const increment = () => setCount(count + 1);

  return (
    <div className="container">
      <p className="lead">Current value: {count}</p>
      <button className="btn btn-primary" onClick={increment}>
        Increment
      </button>
    </div>
  );
}
