import { useMemo, useState, useEffect } from "react";
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
  Spinner,
  Alert,
} from "react-bootstrap";
import { useQuery } from "@tanstack/react-query";
import { getTodos } from "../../features/todo/api";
import type { Todo } from "../../features/todo/types";

function TodoListPage() {
  // react-queryでTodoデータを取得
  const {
    data: todos = [],
    isLoading,
    error,
  } = useQuery<Todo[], Error>({
    queryKey: ["todos"],
    queryFn: getTodos,
  });

  const [selectedId, setSelectedId] = useState<number | null>(null);

  // todosが読み込まれたら、最初の項目を選択状態にする
  useEffect(() => {
    if (!selectedId && todos.length > 0) {
      setSelectedId(todos[0].id);
    }
  }, [todos, selectedId]);

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
    setEditDetail(selected.description); // `detail` -> `description`
    setShowEdit(true);
  };

  const applyEdit = () => {
    if (!selected) return;
    // TODO: APIで更新処理を実装
    console.log("applyEdit", { id: selected.id, editTitle, editDetail });
    setShowEdit(false);
  };

  const handleDelete = () => {
    if (!selected) return;
    if (!confirm("この項目を削除します。よろしいですか？")) return;
    // TODO: APIで削除処理を実装
    console.log("handleDelete", selected.id);
  };

  const handleAdd = () => {
    // TODO: APIで追加処理を実装
    console.log("handleAdd", { newTitle, newDetail });
    setShowAdd(false);
    setNewTitle("");
    setNewDetail("");
  };

  if (isLoading) {
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          エラー: {error.message || "データの取得に失敗しました。"}
        </Alert>
      </Container>
    );
  }

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
                    {selected.description}
                  </Card.Text>
                </Card.Body>
              </>
            ) : (
              <Card.Body className="d-flex align-items-center justify-content-center text-muted">
                {todos.length > 0
                  ? "左の一覧から項目を選択してください。"
                  : "Todo項目がありません。追加してください。"}
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
