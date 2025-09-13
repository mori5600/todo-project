import { API_BASE_URL, HttpMethod } from "../../constants";
import type { TokenPair } from "./types";

export async function login(
  username: string,
  password: string
): Promise<TokenPair> {
  const res = await fetch(`${API_BASE_URL}/auth/token/`, {
    method: HttpMethod.POST,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error("認証に失敗しました");
  return res.json();
}

export async function signup(
  username: string,
  password: string
): Promise<TokenPair> {
  const res = await fetch(`${API_BASE_URL}/auth/register/`, {
    method: HttpMethod.POST,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error("ユーザー登録に失敗しました");
  return res.json();
}
