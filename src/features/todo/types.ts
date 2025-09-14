export type Status = "todo" | "in_progress" | "done";

export type Todo = {
  id: number;
  title: string;
  description: string;
  status: Status;
  created_at: string;
  updated_at: string;
};

export type CreateTodoInput = {
  title: string;
  description?: string;
  status?: Status;
};

export type UpdateTodoInput = Partial<Omit<CreateTodoInput, "title">> & {
  title?: string;
};

export type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export const TodoStatusLabels: Record<Status, string> = {
  todo: "未着手",
  in_progress: "進行中",
  done: "完了",
};
