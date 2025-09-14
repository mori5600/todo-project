import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTodos, createTodo, updateTodo, deleteTodo } from "./api";
import type { Todo, CreateTodoInput, UpdateTodoInput } from "./types";

const KEY = ["todos"];

export function useTodosQuery() {
  return useQuery<Todo[], Error>({
    queryKey: KEY,
    queryFn: getTodos,
  });
}

export function useCreateTodo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateTodoInput) => createTodo(input),
    onSuccess: (newTodo) => {
      qc.setQueryData<Todo[]>(KEY, (prev) =>
        prev ? [newTodo, ...prev] : [newTodo]
      );
    },
  });
}

export function useUpdateTodo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { id: number; input: UpdateTodoInput }) =>
      updateTodo(vars.id, vars.input),
    onSuccess: (updated) => {
      qc.setQueryData<Todo[]>(KEY, (prev) =>
        prev ? prev.map((t) => (t.id === updated.id ? updated : t)) : [updated]
      );
    },
  });
}

export function useDeleteTodo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteTodo(id),
    onSuccess: (_data, id) => {
      qc.setQueryData<Todo[]>(KEY, (prev) =>
        prev ? prev.filter((t) => t.id !== id) : []
      );
    },
  });
}
