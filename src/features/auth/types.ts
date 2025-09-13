export type LoginRequest = {
  username: string;
  password: string;
  rememberMe: boolean;
};

export type TokenPair = { access: string; refresh: string };
