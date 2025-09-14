import { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import type { Status } from "../../features/todo/types";
import { TodoStatusLabels } from "../../features/todo/types";

type Props = {
  show: boolean;
  onHide: () => void;
  onAdd: (title: string, description: string, status: Status) => void;
};

function TodoAddModal({ show, onHide, onAdd }: Props) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [status, setStatus] = useState<Status>("todo");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onAdd(title, desc, status);
    setTitle("");
    setDesc("");
    setStatus("todo");
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>新しいTodoを追加</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="newTitle">
            <Form.Label>タイトル</Form.Label>
            <Form.Control
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={100}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="newDesc">
            <Form.Label>詳細</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="newStatus">
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
            <Button type="submit" variant="success">
              追加
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default TodoAddModal;
