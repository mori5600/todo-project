import { Card, Spinner, Alert } from "react-bootstrap";
import { useMe } from "./hooks";

function AccountSummary() {
  const { data, isLoading, error } = useMe();

  if (isLoading) {
    return (
      <Card>
        <Card.Body>
          <Spinner size="sm" /> 読み込み中...
        </Card.Body>
      </Card>
    );
  }
  if (error) {
    return (
      <Card>
        <Card.Body>
          <Alert variant="danger" className="mb-0">
            取得に失敗: {error.message}
          </Alert>
        </Card.Body>
      </Card>
    );
  }
  if (!data) return null;

  return (
    <Card>
      <Card.Header>アカウント情報</Card.Header>
      <Card.Body>
        <div className="mb-2">
          ユーザー名: <strong>{data.username}</strong>
        </div>
      </Card.Body>
    </Card>
  );
}

export default AccountSummary;
