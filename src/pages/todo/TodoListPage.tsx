import { useState, useEffect, useMemo } from "react";
import {
  Container,
  Row,
  Col,
  Spinner,
  Alert,
  Pagination,
  Form,
} from "react-bootstrap";
import { useTodosPage, useCreateTodo } from "../../features/todo/hooks";
import TodoList from "../../features/todo/TodoList";
import TodoDetail from "../../features/todo/TodoDetail";
import TodoAddModal from "../../features/todo/TodoAddModal";
import TodoEditModal from "../../features/todo/TodoEditModal";

function TodoListPage() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [search, setSearch] = useState("");
  const { data, isLoading, error } = useTodosPage({ page, pageSize, search });
  const createMut = useCreateTodo();

  const todos = data?.results ?? [];
  const total = data?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    if (!selectedId && todos.length > 0) {
      setSelectedId(todos[0].id);
    }
  }, [todos, selectedId]);

  useEffect(() => {
    setSelectedId(null);
  }, [page, search]);

  const selectedTodo = useMemo(
    () => todos.find((t) => t.id === selectedId) ?? null,
    [todos, selectedId]
  );

  if (isLoading) {
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }
  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error.message}</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Row className="mb-3">
        <Col sm={6} className="mb-2">
          <Form.Control
            placeholder="検索..."
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
          />
        </Col>
        <Col
          sm={6}
          className="d-flex align-items-center justify-content-sm-end small text-muted"
        >
          {total} 件 / {totalPages} ページ
        </Col>
      </Row>
      <Row style={{ minHeight: "60vh" }}>
        <Col xs={12} sm={5} md={4} className="mb-3 mb-sm-0">
          <TodoList
            todos={todos}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onAddClick={() => setShowAddModal(true)}
          />
          <div className="d-flex justify-content-center mt-3">
            <Pagination size="sm" className="mb-0">
              <Pagination.First
                disabled={page === 1}
                onClick={() => setPage(1)}
              />
              <Pagination.Prev
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              />
              <Pagination.Item active>{page}</Pagination.Item>
              <Pagination.Next
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              />
              <Pagination.Last
                disabled={page === totalPages}
                onClick={() => setPage(totalPages)}
              />
            </Pagination>
          </div>
        </Col>
        <Col xs={12} sm={7} md={8}>
          <TodoDetail
            todo={selectedTodo}
            onEdit={() => setShowEditModal(true)}
            onDelete={() => {
              // ページング対応の削除ロジックは後で (例: 削除後に再フェッチ)
              alert("削除は未実装（ページング対応版）");
            }}
          />
        </Col>
      </Row>
      <TodoAddModal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        onAdd={(title, description, status) => {
          createMut.mutate(
            { title, description, status },
            {
              onSuccess: () => {
                setShowAddModal(false);
                setPage(1); // 先頭ページに戻す
              },
            }
          );
        }}
      />
      {/* エラー / 進行表示（任意） */}
      {createMut.error && (
        <div className="text-danger small mt-2">
          追加エラー: {createMut.error.message}
        </div>
      )}
      <TodoEditModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        todo={selectedTodo}
        onSave={(values) => {
          console.log("edit", values);
        }}
      />
    </Container>
  );
}

export default TodoListPage;
