// src/components/Header.tsx
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppURL } from "../../constants";
import { tokenStore } from "../../features/auth/tokenStore";

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(tokenStore.isLoggedIn());
  const navigate = useNavigate();

  useEffect(() => {
    const sync = () => setIsLoggedIn(tokenStore.isLoggedIn());

    window.addEventListener(tokenStore.eventName, sync);
    window.addEventListener("storage", sync);
    window.addEventListener("visibilitychange", sync);

    return () => {
      window.removeEventListener(tokenStore.eventName, sync);
      window.removeEventListener("storage", sync);
      window.removeEventListener("visibilitychange", sync);
    };
  }, []);

  return (
    <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand className="fw-bold" as={Link} to="/">
          TODO-PROJECT
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          {isLoggedIn ? (
            <Nav className="ms-auto">
              <Nav.Link as={Link} to={AppURL.ACCOUNT}>
                アカウント
              </Nav.Link>
              <Nav.Link
                onClick={() => {
                  tokenStore.clear(); // トークン削除 → イベント発火 → 再描画
                  navigate(AppURL.LOGIN, { replace: true });
                }}
              >
                ログアウト
              </Nav.Link>
            </Nav>
          ) : (
            <Nav className="ms-auto">
              <Nav.Link as={Link} to={AppURL.LOGIN}>
                ログイン
              </Nav.Link>
              <Nav.Link as={Link} to={AppURL.SIGNUP}>
                サインアップ
              </Nav.Link>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
