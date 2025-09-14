import { useMemo, useState, useEffect } from "react";
import { Container, Row, Col, Spinner, Alert } from "react-bootstrap";
import {
  useTodosQuery,
  useCreateTodo,
  useUpdateTodo,
  useDeleteTodo,
} from "../../features/todo/hooks";
import TodoAddModal from "../../features/todo/TodoAddModal";
import TodoDetail from "../../features/todo/TodoDetail";
import TodoEditModal from "../../features/todo/TodoEditModal";
import TodoList from "../../features/todo/TodoList";

function TodoListPage() {
  const { data: todos = [], isLoading, error } = useTodosQuery();
  const createMut = useCreateTodo();
  const updateMut = useUpdateTodo();
  const deleteMut = useDeleteTodo();

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    if (!selectedId && todos.length > 0) {
      setSelectedId(todos[0].id);
    }
  }, [todos, selectedId]);

  const selectedTodo = useMemo(
    () => todos.find((t) => t.id === selectedId) ?? null,
    [todos, selectedId]
  );

  const handleAdd = (title: string, description: string, status: any) => {
    createMut.mutate({ title, description, status });
  };

  const handleSave = (values: {
    title: string;
    description: string;
    status: any;
  }) => {
    if (!selectedTodo) return;
    updateMut.mutate({
      id: selectedTodo.id,
      input: {
        title: values.title,
        description: values.description,
        status: values.status,
      },
    });
  };

  const handleDelete = () => {
    if (!selectedTodo) return;
    if (!confirm("この項目を削除します。よろしいですか？")) return;
    deleteMut.mutate(selectedTodo.id, {
      onSuccess: () => {
        // 削除対象を選択中なら選択解除
        if (selectedId === selectedTodo.id) {
          setSelectedId(null);
        }
      },
    });
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
        <Col xs={12} sm={5} md={4} className="mb-3 mb-sm-0">
          <TodoList
            todos={todos}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onAddClick={() => setShowAddModal(true)}
          />
        </Col>

        <Col xs={12} sm={7} md={8}>
          <TodoDetail
            todo={selectedTodo}
            onEdit={() => setShowEditModal(true)}
            onDelete={handleDelete}
          />
        </Col>
      </Row>

      <TodoAddModal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        onAdd={handleAdd}
      />

      <TodoEditModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        todo={selectedTodo}
        onSave={handleSave}
      />
      {(createMut.isPending || updateMut.isPending || deleteMut.isPending) && (
        <div className="position-fixed bottom-0 end-0 m-3 small text-muted">
          処理中...
        </div>
      )}
      {(createMut.error || updateMut.error || deleteMut.error) && (
        <div className="position-fixed bottom-0 start-0 m-3 text-danger small">
          {createMut.error?.message ||
            updateMut.error?.message ||
            deleteMut.error?.message}
        </div>
      )}
    </Container>
  );
}

export default TodoListPage;
