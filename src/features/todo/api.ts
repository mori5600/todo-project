import { API_BASE_URL, HttpMethod } from "../../constants";
import { tokenStore } from "../auth/tokenStore";
import type {
  CreateTodoInput,
  Paginated,
  Todo,
  UpdateTodoInput,
} from "./types";

function buildQuery(params: Record<string, any>) {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") return;
    q.set(k, String(v));
  });
  const s = q.toString();
  return s ? `?${s}` : "";
}

async function parseError(res: Response) {
  try {
    const ct = res.headers.get("content-type") || "";
    if (ct.includes("application/json")) {
      const body = await res.json();
      if (body?.message) return String(body.message);
      if (body?.detail) return String(body.detail);
      if (body?.errors) {
        const errs = body.errors;
        if (typeof errs === "string") return errs;
        if (Array.isArray(errs)) return errs.join(" ");
        if (typeof errs === "object") {
          return Object.values(errs)
            .flatMap((v: any) => (Array.isArray(v) ? v : [v]))
            .map(String)
            .join(" ");
        }
      }
      if (typeof body === "object") {
        const msgs = Object.values(body)
          .flatMap((v: any) => (Array.isArray(v) ? v : [v]))
          .map(String);
        if (msgs.length) return msgs.join(" ");
      }
      if (typeof body === "string") return body;
      return JSON.stringify(body);
    }
    return await res.text();
  } catch {
    return `${res.status} ${res.statusText}`;
  }
}

async function authFetch(input: string, init: RequestInit = {}) {
  const tokens = tokenStore.load();
  if (!tokens?.access) {
    throw new Error("認証が必要です。");
  }
  const headers = new Headers(init.headers || {});
  if (!headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${tokens.access}`);
  }
  if (!headers.has("Content-Type") && init.body) {
    headers.set("Content-Type", "application/json");
  }
  const res = await fetch(input, { ...init, headers });
  if (!res.ok) {
    const msg = await parseError(res);
    throw new Error(msg || "リクエストに失敗しました。");
  }
  return res;
}

// 一覧
export async function getTodos(): Promise<Todo[]> {
  const res = await authFetch(`${API_BASE_URL}/todos/`, {
    method: HttpMethod.GET,
  });
  const data: Paginated<Todo> = await res.json();
  return data.results;
}

// 詳細（必要なら）
export async function getTodo(id: number): Promise<Todo> {
  const res = await authFetch(`${API_BASE_URL}/todos/${id}/`, {
    method: HttpMethod.GET,
  });
  return res.json();
}

// 追加
export async function createTodo(input: CreateTodoInput): Promise<Todo> {
  const tokens = tokenStore.load();
  if (!tokens?.access) throw new Error("認証が必要です。");
  const res = await fetch(`${API_BASE_URL}/todos/`, {
    method: HttpMethod.POST,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tokens.access}`,
    },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    let msg = "追加に失敗しました。";
    try {
      const data = await res.json();
      msg =
        data?.message ||
        data?.detail ||
        (typeof data === "object"
          ? Object.values(data).flat().map(String).join(" ")
          : msg);
    } catch {}
    throw new Error(msg);
  }
  return res.json();
}

// 更新（部分更新: PATCH）
export async function updateTodo(
  id: number,
  input: UpdateTodoInput
): Promise<Todo> {
  const tokens = tokenStore.load();
  if (!tokens?.access) throw new Error("認証が必要です。");
  const res = await fetch(`${API_BASE_URL}/todos/${id}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tokens.access}`,
    },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    let msg = "更新に失敗しました。";
    try {
      const data = await res.json();
      msg =
        data?.message ||
        data?.detail ||
        (typeof data === "object"
          ? Object.values(data).flat().map(String).join(" ")
          : msg);
    } catch {}
    throw new Error(msg);
  }
  return res.json();
}

export async function deleteTodo(id: number): Promise<void> {
  const tokens = tokenStore.load();
  if (!tokens?.access) throw new Error("認証が必要です。");
  const res = await fetch(`${API_BASE_URL}/todos/${id}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${tokens.access}`,
    },
  });
  if (!res.ok) {
    let msg = "削除に失敗しました。";
    try {
      const data = await res.json();
      msg =
        data?.message ||
        data?.detail ||
        (typeof data === "object"
          ? Object.values(data).flat().map(String).join(" ")
          : msg);
    } catch {}
    throw new Error(msg);
  }
}

// 1ページ取得
export async function getTodosPage(params: {
  page?: number;
  page_size?: number;
  search?: string;
}): Promise<Paginated<Todo>> {
  const query = buildQuery(params);
  const res = await authFetch(`${API_BASE_URL}/todos/${query}`, {
    method: HttpMethod.GET,
  });
  return res.json();
}
