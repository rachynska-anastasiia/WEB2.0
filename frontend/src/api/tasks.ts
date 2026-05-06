import { apiDelete, apiGet, apiPost, apiPut } from "./client";

export type TaskPriority = "low" | "medium" | "high";
export type BoardStatus = "to_do" | "todo" | "in_progress" | "completed" | "done";

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

export type BoardTaskRow = {
  board_tasks_id: number;
  user_id: number;
  task_id: number;
  status: BoardStatus | null;
  tag: string | null;
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

export async function updateTaskDescription(taskId: number, description: string): Promise<TaskRow> {
  return apiPut<TaskRow>("/tasks/UpdateTaskDescription", { task_id: taskId, description });
}

export async function updateTaskDeadline(taskId: number, dueDate: string): Promise<TaskRow> {
  return apiPut<TaskRow>("/tasks/UpdateTaskDedline", { task_id: taskId, due_date: dueDate });
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

export async function getAllTasksOnBoard(): Promise<BoardTaskRow[]> {
  return apiGet<BoardTaskRow[]>("/concrete_board/GetAllTasksOnBoard");
}