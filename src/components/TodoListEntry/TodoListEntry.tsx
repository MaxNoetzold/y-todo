import { useEffect, useRef, useState } from "preact/hooks";

type TodoListEntryProps = {
  value: string; // or any other type you expect 'value' to be
};

export function TodoListEntry({ value: initValue }: TodoListEntryProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initValue);
  const inputRef = useRef<HTMLInputElement>(null);

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

  if (isEditing) {
    return (
      <div className="container">
        <input
          type="text"
          value={value}
          onChange={(event) =>
            setValue((event.target as HTMLInputElement).value)
          }
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
