import { API_BASE_URL, HttpMethod } from "../../constants";
import type { TokenPair } from "./types";

async function parseErrorMessage(res: Response) {
  const ct = res.headers.get("content-type") ?? "";
  try {
    if (ct.includes("application/json")) {
      const body = await res.json();

      // 典型的なフィールドを順にチェック
      if (body?.message) return String(body.message);
      if (body?.detail) return String(body.detail);

      // Django REST Framework から来る { errors: { field: [msg,...], ... } } を処理
      if (body?.errors) {
        const errs = body.errors;
        if (typeof errs === "string") return errs;
        if (Array.isArray(errs)) return errs.join(" ");
        if (typeof errs === "object") {
          const msgs = Object.values(errs).flatMap((v: any) =>
            Array.isArray(v) ? v : [String(v)]
          );
          return msgs.join(" ");
        }
      }

      // フィールドごとのエラーオブジェクト（例: { password: ["..."] }）
      if (typeof body === "object") {
        const msgs = Object.values(body)
          .flatMap((v: any) => (Array.isArray(v) ? v : [v]))
          .filter(Boolean)
          .map(String);
        if (msgs.length) return msgs.join(" ");
      }

      return typeof body === "string" ? body : JSON.stringify(body);
    }
    // JSON でなければテキストを返す
    return await res.text();
  } catch {
    return `${res.status} ${res.statusText}`;
  }
}

export async function login(
  username: string,
  password: string
): Promise<TokenPair> {
  const res = await fetch(`${API_BASE_URL}/auth/token/`, {
    method: HttpMethod.POST,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    const msg = await parseErrorMessage(res);
    throw new Error(msg || "認証に失敗しました");
  }

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

  if (!res.ok) {
    const msg = await parseErrorMessage(res);
    throw new Error(msg || "サインアップに失敗しました");
  }

  return res.json();
}
