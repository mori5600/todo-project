// import Container from "react-bootstrap/Container";
import Header from "./components/Header";
import LoginPage from "./pages/LoginPage";
import { Routes, Route, Link } from "react-router-dom";

function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/auth/login/" element={<LoginPage />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
