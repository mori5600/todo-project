import { API_BASE_URL, HttpMethod } from "../../constants";
import { tokenStore } from "../auth/tokenStore";
import type { Paginated, Todo } from "./types";

// Todo一覧を取得
export async function getTodos(): Promise<Todo[]> {
  const token = tokenStore.load();
  if (!token?.access) {
    throw new Error("認証トークンがありません。");
  }

  const res = await fetch(`${API_BASE_URL}/todos/`, {
    method: HttpMethod.GET,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token.access}`,
    },
  });

  if (!res.ok) {
    // ここでエラーメッセージをパースする共通関数を使っても良い
    throw new Error("Todoリストの取得に失敗しました。");
  }

  const data: Paginated<Todo> = await res.json();
  return data.results;
}
