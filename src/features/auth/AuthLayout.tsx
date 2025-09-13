import { Outlet } from "react-router-dom";
import RequireAuth from "./RequireAuth";

// 親ルート用のラッパー：複数の認証必須ページをここにまとめる
export default function AuthLayout() {
  return (
    <RequireAuth>
      <Outlet />
    </RequireAuth>
  );
}
