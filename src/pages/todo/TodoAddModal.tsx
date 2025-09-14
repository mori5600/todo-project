import { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";

type Props = {
  show: boolean;
  onHide: () => void;
  onAdd: (title: string, description: string) => void;
};

function TodoAddModal({ show, onHide, onAdd }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onAdd(title, description);
    // フォームをリセットして閉じる
    setTitle("");
    setDescription("");
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
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="newDetail">
            <Form.Label>詳細</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
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
