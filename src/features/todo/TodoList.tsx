import { ListGroup, Button } from "react-bootstrap";
import type { Todo } from "./types";

type Props = {
  todos: Todo[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  onAddClick: () => void;
};

function TodoList({ todos, selectedId, onSelect, onAddClick }: Props) {
  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h5 className="mb-0">Todo一覧</h5>
        <Button size="sm" onClick={onAddClick}>
          ＋追加
        </Button>
      </div>
      <ListGroup>
        {todos.map((t) => (
          <ListGroup.Item
            key={t.id}
            action
            active={t.id === selectedId}
            onClick={() => onSelect(t.id)}
            className="text-truncate"
            title={t.title}
          >
            {t.title}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </>
  );
}

export default TodoList;
