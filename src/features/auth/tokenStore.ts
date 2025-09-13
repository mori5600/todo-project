const ACCESS = "accessToken";
const REFRESH = "refreshToken";

export const tokenStore = {
  save(access: string, refresh: string) {
    localStorage.setItem(ACCESS, access);
    localStorage.setItem(REFRESH, refresh);
  },
  load() {
    return {
      access: localStorage.getItem(ACCESS) ?? "",
      refresh: localStorage.getItem(REFRESH) ?? "",
    };
  },
  clear() {
    localStorage.removeItem(ACCESS);
    localStorage.removeItem(REFRESH);
  },
};
