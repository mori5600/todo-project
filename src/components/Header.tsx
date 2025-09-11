import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { AppURL } from "../constants";

const Header = () => {
  return (
    <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand className="fw-bold" href="/">
          TODO-PROJECT
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link href={AppURL.LOGIN}>ログイン</Nav.Link>
            <Nav.Link eventKey={2} href={AppURL.SIGNUP}>
              サインアップ
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
