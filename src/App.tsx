import Header from "./components/Header";
import LoginPage from "./pages/auth/LoginPage";
import { Routes, Route } from "react-router-dom";
import SignupPage from "./pages/auth/SignupPage";
import { AppURL } from "./constants";

function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path={AppURL.ROOT} element={<LoginPage />} />
          <Route path={AppURL.LOGIN} element={<LoginPage />} />
          <Route path={AppURL.SIGNUP} element={<SignupPage />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
