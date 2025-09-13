export const AppURL = {
  HOME: "/",
  LOGIN: "/auth/login",
  SIGNUP: "/auth/signup",
  TODOLIST: "/todo",
} as const;

export const API_BASE_URL = "http://127.0.0.1:8080/api";

export const HttpMethod = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
} as const;
