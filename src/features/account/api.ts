import { API_BASE_URL } from "../../constants";
import { tokenStore } from "../auth/tokenStore";
import type { Me } from "./types";

async function authFetch(url: string, init?: RequestInit) {
  const tokens = tokenStore.load();
  if (!tokens?.access) throw new Error("認証が必要です。");
  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tokens.access}`,
      ...(init?.headers || {}),
    },
  });
  if (!res.ok) {
    let msg = "リクエストに失敗しました。";
    try {
      const data = await res.json();
      if (typeof data === "object" && data) {
        msg =
          // {"field":["msg"]...} を結合
          (data as any).message ||
          (data as any).detail ||
          Object.values(data).flat().map(String).join(" ") ||
          msg;
      }
    } catch {
      /* ignore */
    }
    throw new Error(msg);
  }
  return res;
}

// 追加: ユーザー情報取得
export async function fetchMe(): Promise<Me> {
  const res = await authFetch(`${API_BASE_URL}/auth/me/`, { method: "GET" });
  return res.json();
}

export async function changePassword(params: {
  old_password: string;
  new_password: string;
}) {
  await authFetch(`${API_BASE_URL}/users/me/password/`, {
    method: "POST",
    body: JSON.stringify(params),
  });
  return true;
}
