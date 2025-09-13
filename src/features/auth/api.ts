import { API_BASE_URL } from "../../constants";
import type { TokenPair } from "./types";

export async function login(
  username: string,
  password: string
): Promise<TokenPair> {
  const res = await fetch(`${API_BASE_URL}/auth/token/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error("認証に失敗しました");
  return res.json();
}
