import { Card, Button, ButtonGroup } from "react-bootstrap";
import type { Todo } from "../../features/todo/types";

type Props = {
  todo: Todo | null;
  onEdit: () => void;
  onDelete: () => void;
};

function TodoDetail({ todo, onEdit, onDelete }: Props) {
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
        <span className="fw-semibold">{todo.title}</span>
        <ButtonGroup size="sm">
          <Button variant="outline-primary" onClick={onEdit}>
            編集
          </Button>
          <Button variant="outline-danger" onClick={onDelete}>
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
