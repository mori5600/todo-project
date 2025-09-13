import type { TokenPair } from "./types";

const ACCESS = "accessToken";
const REFRESH = "refreshToken";
const REMEMBER_ME = "rememberMe";
const AUTH_EVENT = "auth:changed";

const StrBool = {
  true: "true",
  false: "false",
} as const;

function emit() {
  window.dispatchEvent(new Event(AUTH_EVENT));
}

export const tokenStore = {
  save(access: string, refresh: string, rememberMe: boolean) {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem(ACCESS, access);
    storage.setItem(REFRESH, refresh);

    localStorage.setItem(
      REMEMBER_ME,
      rememberMe ? StrBool.true : StrBool.false
    );
    emit();
  },
  load(): TokenPair {
    const rememberMe = localStorage.getItem(REMEMBER_ME) === StrBool.true;
    const storage = rememberMe ? localStorage : sessionStorage;
    return {
      access: storage.getItem(ACCESS) ?? "",
      refresh: storage.getItem(REFRESH) ?? "",
    };
  },
  clear() {
    localStorage.removeItem(ACCESS);
    localStorage.removeItem(REFRESH);
    sessionStorage.removeItem(ACCESS);
    sessionStorage.removeItem(REFRESH);
    localStorage.removeItem(REMEMBER_ME);
    emit();
  },
  isLoggedIn() {
    const { access, refresh } = this.load();
    return !!(access && refresh);
  },
  eventName: AUTH_EVENT,
};
