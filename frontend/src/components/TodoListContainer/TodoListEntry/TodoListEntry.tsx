import { useEffect, useRef, useState } from "preact/hooks";
import * as Y from "yjs";
import Loading from "../../Loading";

type TodoListEntryProps = {
  value: Y.Map<string>;
  handleDelete: Function;
};

export function TodoListEntry({
  value: yValue,
  handleDelete,
}: TodoListEntryProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState<string | null>(null);
  const [checked, setChecked] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // get init value
    setValue(yValue.get("value") || "");
    setChecked(yValue.get("checked") === "true");

    // observe changes
    const observer = (event: Y.YMapEvent<string>) => {
      if (event.keysChanged.has("value")) {
        setValue(event.target.get("value") || "");
      } else if (event.keysChanged.has("checked")) {
        setChecked(event.target.get("checked") === "true");
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

  const handleTextClick = () => {
    setIsEditing(true);
  };

  const handleInputBlur = () => {
    setIsEditing(false);
  };

  const handleInputKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      setIsEditing(false);
    }
  };

  const handleInputChange = (event: InputEvent) => {
    if (event.target instanceof HTMLInputElement) {
      yValue.set("value", event.target.value);
    }
  };

  const handleCheckboxChange = (event: InputEvent) => {
    if (event.target instanceof HTMLInputElement) {
      yValue.set("checked", `${event.target.checked}`);
    }
  };

  if (value === null) {
    return <Loading />;
  }

  return (
    <div
      className="container d-flex justify-content-between align-items-center"
      style={{ height: "24px" }}
    >
      <div className="form-check">
        <input
          className="form-check-input"
          type="checkbox"
          id="flexCheckDefault"
          checked={checked}
          onInput={handleCheckboxChange}
          aria-label={`check "${value}"`}
        />
      </div>
      {isEditing ? (
        <input
          type="text"
          value={value}
          onInput={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleInputKeyDown}
          ref={inputRef}
          className="h-100"
        />
      ) : (
        <div
          style={{
            cursor: "pointer",
            textDecoration: checked ? "line-through" : "none",
          }}
          onClick={handleTextClick}
          className="h-100"
          aria-label={`edit "${value}"`}
        >
          {value}
        </div>
      )}
      <button
        type="button"
        className="btn btn-danger bg-transparent"
        onClick={() => handleDelete()}
        aria-label={`delete "${value}"`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="#dc3545"
          className="bi bi-trash"
          viewBox="0 0 16 16"
        >
          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5z" />
          <path
            fill-rule="evenodd"
            d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1h1.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
          />
        </svg>
      </button>
    </div>
  );
}
