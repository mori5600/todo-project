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
    mutationFn: createTodo,
    onSuccess: () => {
      // すべてのページキャッシュを無効化（queryKey 先頭 'todos' を対象）
      qc.invalidateQueries({ queryKey: ["todos"] });
    },
  });
}

export function useUpdateTodo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (v: { id: number; input: UpdateTodoInput }) =>
      updateTodo(v.id, v.input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["todos"] });
    },
  });
}

export function useDeleteTodo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteTodo(id),
    onSuccess: (_d, _id) => {
      qc.invalidateQueries({ queryKey: ["todos"] });
    },
  });
}

export function useTodosPage(params: {
  page: number;
  pageSize: number;
  search?: string;
}) {
  return useQuery<
    Paginated<Todo>,
    Error,
    Paginated<Todo>,
    [string, { page: number; pageSize: number; search?: string }]
  >({
    queryKey: ["todos", params],
    queryFn: () =>
      getTodosPage({
        page: params.page,
        page_size: params.pageSize,
        search: params.search,
      }),
    keepPreviousData: true, // これでリストが入れ替わらずフォーカス維持
  } as UseQueryOptions<Paginated<Todo>, Error, Paginated<Todo>, [string, { page: number; pageSize: number; search?: string }]>);
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
