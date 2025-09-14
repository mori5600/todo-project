export type Todo = {
  id: number;
  title: string;
  description: string;
  status: "todo" | "in_progress" | "done";
  created_at: string;
  updated_at: string;
};

export type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};
