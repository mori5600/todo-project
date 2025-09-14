import { Card, Button, ButtonGroup, Badge } from "react-bootstrap";
import { TodoStatusLabels } from "./types";
import type { Todo } from "./types";

type Props = {
  todo: Todo | null;
  onEdit: () => void;
  onDelete: () => void;
  disabled?: boolean;
};

function TodoDetail({ todo, onEdit, onDelete, disabled }: Props) {
  if (!todo) {
    return (
      <Card className="h-100" style={{ minHeight: "60vh" }}>
        <Card.Body className="d-flex align-items-center justify-content-center text-muted">
          左の一覧から項目を選択するか、新しいTodoを追加してください。
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="h-100" style={{ minHeight: "60vh" }}>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <span className="fw-semibold d-flex align-items-center gap-2">
          {todo.title}
          <Badge
            bg={
              todo.status === "done"
                ? "success"
                : todo.status === "in_progress"
                ? "warning"
                : "secondary"
            }
          >
            {TodoStatusLabels[todo.status]}
          </Badge>
        </span>
        <ButtonGroup size="sm">
          <Button
            variant="outline-primary"
            onClick={onEdit}
            disabled={disabled}
          >
            編集
          </Button>
          <Button
            variant="outline-danger"
            onClick={onDelete}
            disabled={disabled}
          >
            削除
          </Button>
        </ButtonGroup>
      </Card.Header>
      <Card.Body>
        <Card.Text style={{ whiteSpace: "pre-wrap" }}>
          {todo.description}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default TodoDetail;
