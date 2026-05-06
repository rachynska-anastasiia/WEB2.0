import { apiDelete, apiGet, apiPost, apiPut } from "./client";

export type TaskPriority = "low" | "medium" | "high";
export type BoardStatus = "to_do" | "in_progress" | "completed";

export type TaskRow = {
  task_id: number;
  user_id: number;
  title: string;
  description: string | null;
  due_date: string | null;
  priority: TaskPriority;
  board_tasks_id: number | null;
  tag: string | null;
  status: BoardStatus | null;
};

export async function getTasks(): Promise<TaskRow[]> {
  return apiGet<TaskRow[]>("/tasks");
}

export async function createTask(title: string, description: string): Promise<TaskRow> {
  return apiPost<TaskRow>("/tasks/addTask", { title, description });
}

export async function updateTaskPriority(taskId: number, priority: TaskPriority): Promise<TaskRow> {
  return apiPut<TaskRow>("/tasks/UpdateTaskPriority", { task_id: taskId, priority });
}

export async function updateTaskTitle(taskId: number, title: string): Promise<TaskRow> {
  return apiPut<TaskRow>("/tasks/UpdateTaskTitle", { task_id: taskId, title });
}

export async function deleteTask(taskId: number): Promise<TaskRow> {
  return apiDelete<TaskRow>("/tasks/deleteTask", { task_id: taskId });
}

export async function addTaskToBoard(taskId: number): Promise<{ board_tasks_id: number }> {
  return apiPost<{ board_tasks_id: number }>("/concrete_board/addTaskToBoard", { task_id: taskId });
}

export async function updateTaskStatusOnBoard(boardTasksId: number, status: BoardStatus): Promise<unknown> {
  return apiPut<unknown>("/concrete_board/updateTaskStatusOnBoard", {
    board_tasks_id: boardTasksId,
    status,
  });
}