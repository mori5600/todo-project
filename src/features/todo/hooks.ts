import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
  type UseQueryOptions,
} from "@tanstack/react-query";
import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  getTodosPage,
} from "./api";
import type { Todo, UpdateTodoInput, Paginated } from "./types";

const TODOS_KEY = "todos";

export function useTodosQuery() {
  return useQuery<Todo[], Error>({
    queryKey: [TODOS_KEY],
    queryFn: getTodos,
  });
}

export function useTodosPage(params: {
  page: number;
  pageSize: number;
  search?: string;
}) {
  return useQuery({
    queryKey: [TODOS_KEY, params],
    queryFn: () =>
      getTodosPage({
        page: params.page,
        page_size: params.pageSize,
        search: params.search,
      }),
  });
}

// 無限スクロール
export function useInfiniteTodos(params: {
  pageSize: number;
  search?: string;
}) {
  return useInfiniteQuery<Paginated<Todo>, Error>({
    queryKey: ["todos", "infinite", params],
    queryFn: (context) => {
      const pageParam = (context?.pageParam as number) ?? 1;
      return getTodosPage({
        page: pageParam,
        page_size: params.pageSize,
        search: params.search,
      });
    },
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.next) return undefined;
      return allPages.length + 1;
    },
    initialPageParam: 1,
  });
}

export function useCreateTodo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createTodo,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [TODOS_KEY] });
    },
  });
}

export function useUpdateTodo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (v: { id: number; input: UpdateTodoInput }) =>
      updateTodo(v.id, v.input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [TODOS_KEY] });
    },
  });
}

export function useDeleteTodo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteTodo(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [TODOS_KEY] });
    },
  });
}
