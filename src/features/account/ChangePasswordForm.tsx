import { useState } from "react";
import { Form, Button, Alert, Card, Spinner } from "react-bootstrap";
import { useChangePassword } from "./hooks";

function ChangePasswordForm() {
  const mut = useChangePassword();
  const [oldPw, setOldPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [newPw2, setNewPw2] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setDone(false);

    const old_password = oldPw.trim();
    const new_password = newPw.trim();
    const new_password_confirm = newPw2.trim();

    if (!old_password || !new_password) {
      setError("現在と新しいパスワードを入力してください。");
      return;
    }
    if (new_password !== new_password_confirm) {
      setError("新しいパスワードが一致しません。");
      return;
    }

    mut.mutate(
      { old_password, new_password },
      {
        onSuccess: () => {
          setDone(true);
          setOldPw("");
          setNewPw("");
          setNewPw2("");
        },
        onError: (err: any) => {
          setError(err?.message || "変更に失敗しました。");
        },
      }
    );
  };

  return (
    <Card>
      <Card.Header>パスワード変更</Card.Header>
      <Card.Body>
        <Form onSubmit={onSubmit}>
          {error && (
            <Alert variant="danger" className="py-2">
              {error}
            </Alert>
          )}
          {done && (
            <Alert variant="success" className="py-2">
              変更しました。
            </Alert>
          )}
          <Form.Group className="mb-3" controlId="oldPw">
            <Form.Label>現在のパスワード</Form.Label>
            <Form.Control
              type="password"
              value={oldPw}
              onChange={(e) => setOldPw(e.target.value)}
              autoComplete="current-password"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="newPw">
            <Form.Label>新しいパスワード</Form.Label>
            <Form.Control
              type="password"
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
              autoComplete="new-password"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="newPw2">
            <Form.Label>新しいパスワード（確認）</Form.Label>
            <Form.Control
              type="password"
              value={newPw2}
              onChange={(e) => setNewPw2(e.target.value)}
              autoComplete="new-password"
              required
            />
          </Form.Group>
          <div className="d-flex justify-content-end">
            <Button type="submit" variant="primary" disabled={mut.isPending}>
              {mut.isPending ? (
                <>
                  <Spinner size="sm" className="me-1" /> 送信中
                </>
              ) : (
                "変更する"
              )}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default ChangePasswordForm;
