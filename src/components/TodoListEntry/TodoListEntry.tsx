type TodoListEntryProps = {
  value: string; // or any other type you expect 'value' to be
};

export function TodoListEntry({ value }: TodoListEntryProps) {
  return <div>{value}</div>;
}
