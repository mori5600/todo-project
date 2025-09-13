import type { ReactNode } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { AppURL } from "../../constants";
import { tokenStore } from "./tokenStore";

type Props = {
  children: ReactNode;
};

export default function RequireAuth({ children }: Props) {
  const location = useLocation();

  if (tokenStore.isLoggedIn()) {
    return children as any;
  }

  // 未ログインならログインページへリダイレクト（戻り先を state に保持）
  return (
    <Navigate to={AppURL.LOGIN} replace state={{ from: location.pathname }} />
  );
}
