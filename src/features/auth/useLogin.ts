import { useMutation } from "@tanstack/react-query";
import { api } from "../../api/client";

type TokenPair = { access: string; refresh: string };
type Vars = { username: string; password: string };

export function useLogin() {
  return useMutation<TokenPair, Error, Vars>({
    mutationFn: async (v) => {
      const res = await api.post("/auth/token/", v);
      return res.data;
    },
  });
}
