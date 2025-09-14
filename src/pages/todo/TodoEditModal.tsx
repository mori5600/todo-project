import { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import type { Todo, Status } from "../../features/todo/types";
import { TodoStatusLabels } from "../../features/todo/types";

type Props = {
  show: boolean;
  onHide: () => void;
  todo: Todo | null;
  onSave: (values: {
    title: string;
    description: string;
    status: Status;
  }) => void;
};

function TodoEditModal({ show, onHide, todo, onSave }: Props) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [status, setStatus] = useState<Status>("todo");

  useEffect(() => {
    if (todo) {
      setTitle(todo.title);
      setDesc(todo.description || "");
      setStatus(todo.status);
    }
  }, [todo, show]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave({ title, description: desc, status });
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>項目を編集</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="editTitle">
            <Form.Label>タイトル</Form.Label>
            <Form.Control
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={100}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="editDesc">
            <Form.Label>詳細</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="editStatus">
            <Form.Label>ステータス</Form.Label>
            <Form.Select
              value={status}
              onChange={(e) => setStatus(e.target.value as Status)}
            >
              {Object.entries(TodoStatusLabels).map(([v, label]) => (
                <option key={v} value={v}>
                  {label}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={onHide}>
              キャンセル
            </Button>
            <Button type="submit" variant="primary">
              保存
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default TodoEditModal;
