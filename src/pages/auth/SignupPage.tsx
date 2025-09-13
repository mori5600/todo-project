import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Link, useNavigate } from "react-router-dom";
import { AppURL } from "../../constants";
import { signup } from "../../features/auth/api";
import { useState } from "react";
import Alert from "react-bootstrap/Alert";

function SignupPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;
    setError(null);

    const name = username.trim();
    if (!name || !password) {
      setError("ユーザー名とパスワードを入力してください。");
      return;
    }
    if (password !== confirmPassword) {
      setError("パスワードが一致しません。");
      return;
    }

    setIsSubmitting(true);
    try {
      await signup(name, password);
      // サインアップ成功 → ログインページへ遷移
      navigate(AppURL.LOGIN, { replace: true });
    } catch (err) {
      const anyErr = err as any;
      const msg =
        anyErr?.response?.data?.message ??
        anyErr?.message ??
        "サインアップに失敗しました。";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col xs={12} sm={8} md={6} lg={4}>
          <Card className="p-3">
            <Card.Body>
              <Card.Title className="mb-4 text-center">サインアップ</Card.Title>
              <Form onSubmit={handleSubmit}>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form.Group className="mb-3" controlId="usernameForm">
                  <Form.Control
                    type="text"
                    placeholder="ユーザー名"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="passwordForm">
                  <Form.Control
                    type="password"
                    placeholder="パスワード"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="confirmPasswordForm">
                  <Form.Control
                    type="password"
                    placeholder="パスワード（確認）"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </Form.Group>
                <Button
                  variant="primary"
                  type="submit"
                  className="w-100"
                  disabled={isSubmitting}
                >
                  サインアップ
                </Button>
              </Form>
              <div className="mt-3 text-center">
                <Link to={AppURL.LOGIN}>ログインする</Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default SignupPage;
