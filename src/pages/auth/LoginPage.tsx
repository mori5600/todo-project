import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Link, useNavigate } from "react-router-dom";
import { AppURL } from "../../constants";
import { useState, type FormEvent } from "react";
import type { LoginRequest } from "../../features/auth/types";

// モック認証（1秒待って "admin"/"admin" なら成功）
const mockLogin = (u: string, p: string) =>
  new Promise<boolean>((resolve) =>
    setTimeout(() => resolve(u === "admin" && p === "admin"), 1000)
  );

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const redirectTo = AppURL.HOME;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const loginRequest: LoginRequest = {
        username,
        password,
        rememberMe,
      };

      const ok = await mockLogin(loginRequest.username, loginRequest.password);
      if (!ok) {
        setError("ユーザー名またはパスワードが正しくありません。");
        return;
      }

      // 疑似トークン保存（rememberMe で保持先を切替）
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem("authToken", "mock-token");
      storage.setItem("username", loginRequest.username);

      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const canSubmit = username.trim() !== "" && password.trim() !== "";

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col xs={12} sm={8} md={6} lg={4}>
          <Card className="p-3">
            <Card.Body>
              <Card.Title className="mb-4 text-center">ログイン</Card.Title>

              <Form onSubmit={handleSubmit} noValidate>
                <Form.Group className="mb-3" controlId="usernameForm">
                  <Form.Control
                    type="text"
                    placeholder="ユーザー名"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    autoComplete="username"
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="passwordForm">
                  <Form.Control
                    type="password"
                    placeholder="パスワード"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="rememberCheckbox">
                  <Form.Check
                    type="checkbox"
                    label="ログインしたままにする"
                    checked={rememberMe}
                    onChange={() => setRememberMe((v) => !v)}
                  />
                </Form.Group>

                {error && (
                  <div className="text-danger mb-3" role="alert">
                    {error}
                  </div>
                )}

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100"
                  disabled={!canSubmit || loading}
                >
                  {loading ? "ログイン中..." : "ログイン"}
                </Button>
              </Form>

              <div className="mt-3 text-center">
                <Link to={AppURL.SIGNUP}>アカウントを作成する</Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default LoginPage;
