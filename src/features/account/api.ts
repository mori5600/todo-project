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
  if (!res.ok) throw new Error("ユーザー情報の取得に失敗しました。");
  return res;
}

export async function fetchMe(): Promise<Me> {
  const res = await authFetch(`${API_BASE_URL}/auth/me/`);
  return res.json();
}
