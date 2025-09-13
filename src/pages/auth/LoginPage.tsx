import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Link, useNavigate } from "react-router-dom";
import { AppURL } from "../../constants";
import { useState, type FormEvent } from "react";
import { useLogin } from "../../features/auth/useLogin";
import { tokenStore } from "../../features/auth/tokenStore";

const ErrorMessage = {
  FAILED_TO_LOGIN: "認証に失敗しました。",
};

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const redirectTo = AppURL.TODOLIST;
  const login = useLogin(); // useMutation を返す（mutate / mutateAsync / isPending / error など）

  const getErrorMessage = (e: unknown) => {
    // Axios の場合やサーバーの message を拾う
    if (!e) return ErrorMessage.FAILED_TO_LOGIN;
    const anyErr = e as any;
    if (typeof anyErr === "string") return anyErr;
    if (anyErr?.message) return anyErr.message;
    if (anyErr?.response?.data?.message) return anyErr.response.data.message;
    return ErrorMessage.FAILED_TO_LOGIN;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (login.isPending) return;
    setError(null);

    try {
      const { access, refresh } = await login.mutateAsync({
        username,
        password,
      });

      tokenStore.clear();
      tokenStore.save(access, refresh, rememberMe);

      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
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
                  <Form.Label className="visually-hidden">
                    ユーザー名
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="ユーザー名"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      setError(null);
                      login.reset?.();
                    }}
                    required
                    autoComplete="username"
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="passwordForm">
                  <Form.Label className="visually-hidden">
                    パスワード
                  </Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="パスワード"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError(null);
                      login.reset?.();
                    }}
                    required
                    autoComplete="current-password"
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="rememberCheckbox">
                  <Form.Check
                    type="checkbox"
                    label="ログインしたままにする"
                    checked={rememberMe}
                    onChange={() => {
                      setRememberMe((v) => !v);
                      setError(null);
                    }}
                  />
                </Form.Group>

                {(error || (login.error as unknown as Error)) && (
                  <div className="text-danger mb-3" role="alert">
                    {error ?? getErrorMessage(login.error)}
                  </div>
                )}

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100"
                  disabled={!canSubmit || login.isPending}
                >
                  {login.isPending ? "ログイン中..." : "ログイン"}
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
