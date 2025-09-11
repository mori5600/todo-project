import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Link, useNavigate } from "react-router-dom";
import { AppURL } from "../../constants";
import { useState, type FormEvent } from "react";

class LoginData {
  username: string;
  password: string;
  rememberMe: boolean;

  constructor(username: string, password: string, rememberMe: boolean) {
    if (username === "" || password === "") {
      throw new Error("ユーザー名またはパスワードが未入力です");
    }
    this.username = username;
    this.password = password;
    this.rememberMe = rememberMe;
  }
}

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const loginData = new LoginData(username, password, rememberMe);
      console.log(`ログインデータ: ${loginData}`);

      const success = true;

      if (success) {
        navigate("/"); // TODO: URLを仮置き
      } else {
        alert("ログインに失敗しました");
      }
    } catch (error) {
      alert((error as Error).message);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col xs={12} sm={8} md={6} lg={4}>
          <Card className="p-3">
            <Card.Body>
              <Card.Title className="mb-4 text-center">ログイン</Card.Title>
              <Form onSubmit={handleSubmit}>
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
                <Form.Group className="mb-3" controlId="rememberCheckbox">
                  <Form.Check
                    type="checkbox"
                    label="ログインしたままにする"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className="w-100">
                  ログイン
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
