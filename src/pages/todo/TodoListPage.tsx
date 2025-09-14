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

// 簡易デバウンスフック（ローカル実装）
function useDebouncedValue<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

function TodoListPage() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const search = useDebouncedValue(searchInput, 300); // API へ送る検索語を遅延

  const { data, isFetching, error } = useTodosPage({ page, pageSize, search });
  const createMut = useCreateTodo();

  const todos = data?.results ?? [];
  const total = data?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // 初期 / データ変化で選択
  useEffect(() => {
    if (!selectedId && todos.length > 0) {
      setSelectedId(todos[0].id);
    }
  }, [todos, selectedId]);

  // ページや検索語変更で選択解除
  useEffect(() => {
    setSelectedId(null);
  }, [page, search]);

  const selectedTodo = useMemo(
    () => todos.find((t) => t.id === selectedId) ?? null,
    [todos, selectedId]
  );

  return (
    <Container className="mt-4">
      {error && (
        <Alert variant="danger" className="mb-3">
          {error.message}
        </Alert>
      )}

      <Row className="mb-3">
        <Col sm={6} className="mb-2">
          <Form.Control
            placeholder="検索..."
            value={searchInput}
            onChange={(e) => {
              setPage(1);
              setSearchInput(e.target.value);
            }}
          />
        </Col>
        <Col
          sm={6}
          className="d-flex align-items-center justify-content-sm-end small text-muted"
        >
          {isFetching && (
            <Spinner
              size="sm"
              animation="border"
              className="me-2"
              role="status"
            />
          )}
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
              // TODO: 削除実装
              alert("削除は未実装");
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
                setPage(1);
              },
            }
          );
        }}
      />

      <TodoEditModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        todo={selectedTodo}
        onSave={(values) => {
          // TODO: 更新実装
          console.log("update", values);
        }}
      />

      {createMut.isPending && (
        <div className="position-fixed bottom-0 end-0 m-3 small text-muted">
          追加中...
        </div>
      )}
      {createMut.error && (
        <div className="position-fixed bottom-0 start-0 m-3 text-danger small">
          {createMut.error.message}
        </div>
      )}
    </Container>
  );
}

export default TodoListPage;
