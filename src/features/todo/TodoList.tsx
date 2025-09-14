import { ListGroup, Button, Badge } from "react-bootstrap";
import { TodoStatusLabels } from "./types";
import type { Status, Todo } from "./types";

type Props = {
  todos: Todo[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  onAddClick: () => void;
};

const statusVariant: Record<Status, string> = {
  todo: "secondary",
  in_progress: "warning",
  done: "success",
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
            <div className="d-flex justify-content-between align-items-center">
              <span className="me-2 text-truncate">{t.title}</span>
              <Badge bg={statusVariant[t.status]}>
                {TodoStatusLabels[t.status]}
              </Badge>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </>
  );
}

export default TodoList;
