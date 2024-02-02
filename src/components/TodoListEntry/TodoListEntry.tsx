import { useEffect, useRef, useState } from "preact/hooks";
import * as Y from "yjs";
import Loading from "../Loading";

type TodoListEntryProps = {
  value: Y.Map<string>; // or any other type you expect 'value' to be
};

export function TodoListEntry({ value: yValue }: TodoListEntryProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // get init value
    const currentValue = yValue.get("value") || "";
    setValue(currentValue);

    // observe changes
    const observer = (event: Y.YMapEvent<string>) => {
      if (event.keysChanged.has("value")) {
        setValue(event.target.get("value") || "");
      }
    };
    yValue.observe(observer);

    return () => {
      yValue.unobserve(observer);
    };
  }, [yValue]);

  // Focus the input field when editing
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      setIsEditing(false);
    }
  };

  const handleChange = (event: InputEvent) => {
    if (event.target instanceof HTMLInputElement) {
      yValue.set("value", event.target.value);
    }
  };

  if (value === null) {
    return <Loading />;
  }

  if (isEditing) {
    return (
      <div className="container">
        <input
          type="text"
          value={value}
          onInput={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          ref={inputRef}
        />
      </div>
    );
  } else {
    return (
      <div className="container">
        <div style={{ cursor: "pointer" }} onClick={handleClick}>
          {value}
        </div>
      </div>
    );
  }
}
