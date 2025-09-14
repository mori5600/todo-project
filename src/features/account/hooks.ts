import { useQuery, useMutation } from "@tanstack/react-query";
import { changePassword, fetchMe } from "./api";
import type { Me } from "./types";

export function useMe() {
  return useQuery<Me, Error>({
    queryKey: ["me"],
    queryFn: fetchMe,
    staleTime: 60_000,
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (v: { old_password: string; new_password: string }) =>
      changePassword(v),
  });
}
