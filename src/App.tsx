import Header from "./components/Header";
import LoginPage from "./pages/auth/LoginPage";
import { Routes, Route } from "react-router-dom";
import SignupPage from "./pages/auth/SignupPage";
import { AppURL } from "./constants";
import TodoList from "./pages/todo/TodoListPage";

function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path={AppURL.HOME} element={<LoginPage />} />
          <Route path={AppURL.LOGIN} element={<LoginPage />} />
          <Route path={AppURL.SIGNUP} element={<SignupPage />} />
          <Route path={AppURL.TODOLIST} element={<TodoList />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
