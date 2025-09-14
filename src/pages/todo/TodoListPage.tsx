import { useMemo, useState, useEffect } from "react";
import { Container, Row, Col, Spinner, Alert } from "react-bootstrap";
import { useQuery } from "@tanstack/react-query";
import { getTodos } from "../../features/todo/api";
import type { Todo } from "../../features/todo/types";
import TodoAddModal from "./TodoAddModal";
import TodoDetail from "./TodoDetail";
import TodoEditModal from "./TodoEditModal";
import TodoList from "./TodoList";

function TodoListPage() {
  const {
    data: todos = [],
    isLoading,
    error,
  } = useQuery<Todo[], Error>({
    queryKey: ["todos"],
    queryFn: getTodos,
  });

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

  const handleAdd = (title: string, description: string) => {
    // TODO: APIで追加処理を実装 (useMutation)
    console.log("handleAdd", { title, description });
  };

  const handleSave = (title: string, description: string) => {
    if (!selectedTodo) return;
    // TODO: APIで更新処理を実装 (useMutation)
    console.log("handleSave", { id: selectedTodo.id, title, description });
  };

  const handleDelete = () => {
    if (!selectedTodo) return;
    if (!confirm("この項目を削除します。よろしいですか？")) return;
    // TODO: APIで削除処理を実装 (useMutation)
    console.log("handleDelete", selectedTodo.id);
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
    </Container>
  );
}

export default TodoListPage;
