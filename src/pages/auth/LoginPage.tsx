import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import { AppURL } from "../../constants";

function LoginPage() {
  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col xs={12} sm={8} md={6} lg={4}>
          <Card className="p-3">
            <Card.Body>
              <Card.Title className="mb-4 text-center">ログイン</Card.Title>
              <Form>
                <Form.Group className="mb-3" controlId="usernameForm">
                  <Form.Control type="text" placeholder="ユーザー名" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="passwordForm">
                  <Form.Control type="password" placeholder="パスワード" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="rememberCheckbox">
                  <Form.Check type="checkbox" label="ログインしたままにする" />
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
