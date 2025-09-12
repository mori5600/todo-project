import { useMemo, useState } from "react";
import {
  Container,
  Row,
  Col,
  ListGroup,
  Card,
  Button,
  ButtonGroup,
  Modal,
  Form,
} from "react-bootstrap";

type Todo = {
  id: string;
  title: string;
  detail: string;
};

const INITIAL: Todo[] = [
  { id: "1", title: "買い物", detail: "牛乳・卵・パンを購入" },
  { id: "2", title: "資料作成", detail: "来週分の議事メモ" },
  { id: "3", title: "掃除", detail: "リビング周り" },
];

function TodoListPage() {
  const [todos, setTodos] = useState<Todo[]>(INITIAL);
  const [selectedId, setSelectedId] = useState<string | null>(
    INITIAL[0]?.id ?? null
  );

  const selected = useMemo(
    () => todos.find((t) => t.id === selectedId) ?? null,
    [todos, selectedId]
  );

  // 編集モーダル
  const [showEdit, setShowEdit] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDetail, setEditDetail] = useState("");

  // 追加モーダル
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDetail, setNewDetail] = useState("");

  const openEdit = () => {
    if (!selected) return;
    setEditTitle(selected.title);
    setEditDetail(selected.detail);
    setShowEdit(true);
  };

  const applyEdit = () => {
    if (!selected) return;
    setTodos((prev) =>
      prev.map((t) =>
        t.id === selected.id
          ? { ...t, title: editTitle, detail: editDetail }
          : t
      )
    );
    setShowEdit(false);
  };

  const handleDelete = () => {
    if (!selected) return;
    if (!confirm("この項目を削除します。よろしいですか？")) return;
    setTodos((prev) => prev.filter((t) => t.id !== selected.id));
    setSelectedId((prevId) => {
      const remain = todos.filter((t) => t.id !== prevId);
      return remain[0]?.id ?? null;
    });
  };

  const handleAdd = () => {
    const id = Date.now().toString(); // 簡易ID
    const newTodo: Todo = { id, title: newTitle, detail: newDetail };
    setTodos((prev) => [...prev, newTodo]);
    setSelectedId(id);
    setShowAdd(false);
    setNewTitle("");
    setNewDetail("");
  };

  return (
    <Container className="mt-4">
      <Row style={{ minHeight: "60vh" }}>
        {/* 左：一覧 */}
        <Col xs={12} sm={5} md={4} className="mb-3 mb-sm-0">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5 className="mb-0">Todo一覧</h5>
            <Button size="sm" onClick={() => setShowAdd(true)}>
              ＋追加
            </Button>
          </div>
          <ListGroup>
            {todos.map((t) => (
              <ListGroup.Item
                key={t.id}
                action
                active={t.id === selectedId}
                onClick={() => setSelectedId(t.id)}
                className="text-truncate"
                title={t.title}
              >
                {t.title}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>

        {/* 右：詳細 */}
        <Col xs={12} sm={7} md={8}>
          <Card className="h-100" style={{ minHeight: "60vh" }}>
            {selected ? (
              <>
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <span className="fw-semibold">{selected.title}</span>
                  <ButtonGroup size="sm">
                    <Button variant="outline-primary" onClick={openEdit}>
                      編集
                    </Button>
                    <Button variant="outline-danger" onClick={handleDelete}>
                      削除
                    </Button>
                  </ButtonGroup>
                </Card.Header>
                <Card.Body>
                  <Card.Text style={{ whiteSpace: "pre-wrap" }}>
                    {selected.detail}
                  </Card.Text>
                </Card.Body>
              </>
            ) : (
              <Card.Body className="d-flex align-items-center justify-content-center text-muted">
                左の一覧から項目を選択してください。
              </Card.Body>
            )}
          </Card>
        </Col>
      </Row>

      {/* 編集モーダル */}
      <Modal show={showEdit} onHide={() => setShowEdit(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>項目を編集</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              applyEdit();
            }}
          >
            <Form.Group className="mb-3" controlId="editTitle">
              <Form.Label>タイトル</Form.Label>
              <Form.Control
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="editDetail">
              <Form.Label>詳細</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                value={editDetail}
                onChange={(e) => setEditDetail(e.target.value)}
              />
            </Form.Group>
            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => setShowEdit(false)}>
                キャンセル
              </Button>
              <Button type="submit" variant="primary">
                保存
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* 追加モーダル */}
      <Modal show={showAdd} onHide={() => setShowAdd(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>新しいTodoを追加</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              handleAdd();
            }}
          >
            <Form.Group className="mb-3" controlId="newTitle">
              <Form.Label>タイトル</Form.Label>
              <Form.Control
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="newDetail">
              <Form.Label>詳細</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                value={newDetail}
                onChange={(e) => setNewDetail(e.target.value)}
              />
            </Form.Group>
            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => setShowAdd(false)}>
                キャンセル
              </Button>
              <Button type="submit" variant="success">
                追加
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default TodoListPage;
