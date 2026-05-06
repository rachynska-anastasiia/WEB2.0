import { type FormEvent, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  addTaskToBoard,
  createTask,
  deleteTask,
  getAllTasksOnBoard,
  getTasks,
  updateTaskStatusOnBoard,
  type BoardStatus,
  type BoardTaskRow,
  type TaskRow,
} from "../api/tasks";

type ColumnId = "todo" | "doing" | "done";

const COLUMNS: { id: ColumnId; title: string }[] = [
  { id: "todo", title: "Нові" },
  { id: "doing", title: "В роботі" },
  { id: "done", title: "Готово" },
];

function mapTaskToColumn(task: TaskRow): ColumnId {
  if (task.status === "done") return "done";
  if (task.status === "in_progress") return "doing";
  if (task.status === "completed") return "done";
  return "todo";
}

function mapColumnToStatus(columnId: ColumnId): BoardStatus {
  if (columnId === "doing") return "in_progress";
  if (columnId === "done") return "completed";
  return "to_do";
}

export default function TasksPage() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<TaskRow[]>([]);
  const [search, setSearch] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function loadTasks() {
    try {
      setLoading(true);
      setError(null);
      const [baseTasks, boardTasks] = await Promise.all([getTasks(), getAllTasksOnBoard()]);
      const boardByTaskId = new Map<number, BoardTaskRow>();
      for (const board of boardTasks) {
        boardByTaskId.set(board.task_id, board);
      }

      const mergedTasks = baseTasks.map((task) => {
        const board = boardByTaskId.get(task.task_id);
        if (!board) return task;
        return {
          ...task,
          board_tasks_id: board.board_tasks_id,
          status: board.status,
        };
      });

      setTasks(mergedTasks);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не вдалося завантажити таски");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadTasks();
  }, []);

  async function handleCreateTask(e: FormEvent) {
    e.preventDefault();
    const t = title.trim();
    const d = description.trim();
    if (!t || !d) return;
    try {
      setError(null);
      await createTask(t, d);
      setTitle("");
      setDescription("");
      await loadTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не вдалося створити таск");
    }
  }

  async function handleDeleteTask(taskId: number) {
    try {
      setError(null);
      await deleteTask(taskId);
      await loadTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не вдалося видалити таск");
    }
  }

  function openTaskDetails(task: TaskRow) {
    navigate("/one-task", { state: { task } });
  }

  async function handleMoveTask(task: TaskRow, direction: "left" | "right") {
    const currentColumn = mapTaskToColumn(task);
    const index = COLUMNS.findIndex((col) => col.id === currentColumn);
    const targetIndex = direction === "left" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= COLUMNS.length) return;

    const targetColumn = COLUMNS[targetIndex].id;
    const targetStatus = mapColumnToStatus(targetColumn);

    try {
      setError(null);

      let boardTasksId = task.board_tasks_id;
      if (!boardTasksId) {
        const board = await addTaskToBoard(task.task_id);
        boardTasksId = board.board_tasks_id;
      }

      await updateTaskStatusOnBoard(boardTasksId, targetStatus);
      await loadTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не вдалося змінити статус задачі");
    }
  }

  const visibleTasks = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return tasks;
    return tasks.filter((t) => t.title.toLowerCase().includes(q));
  }, [tasks, search]);

  return (
    <main className="page page-tasks">
      <h1>Таски</h1>

      <form className="tasks-search-container tasks-create-row" onSubmit={handleCreateTask}>
        <input
          className="tasks-search-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Назва нової задачі"
        />
        <input
          className="tasks-search-input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Опис"
        />
        <button type="submit">Додати завдання</button>
      </form>

      <div className="tasks-search-container">
        <input
          type="search"
          className="tasks-search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Пошук за назвою"
        />
      </div>

      {error ? <p className="jobs-error">{error}</p> : null}
      {loading ? <p className="hint">Завантаження...</p> : null}

      <div className="board">
        {COLUMNS.map((col) => (
          <section key={col.id} className="board-column">
            <h2 className="board-column-title">{col.title}</h2>
            <div className="board-column-cards">
              {visibleTasks
                .filter((task) => mapTaskToColumn(task) === col.id)
                .map((task) => (
                  <article key={task.task_id} className="task-card">
                    <h3 className="task-card-title">{task.title}</h3>
                    <p className="task-card-meta">#{task.task_id}</p>
                    <p className="task-card-meta">{task.description || "-"}</p>
                    <p className="task-card-meta">Пріоритет: {task.priority}</p>
                    <div className="task-card-buttons">
                      {col.id !== "todo" && (
                        <button
                          type="button"
                          className="task-card-button"
                          onClick={() => void handleMoveTask(task, "left")}
                          title="Перемістити ліворуч"
                        >
                          ←
                        </button>
                      )}
                      {col.id !== "done" && (
                        <button
                          type="button"
                          className="task-card-button"
                          onClick={() => void handleMoveTask(task, "right")}
                          title="Перемістити праворуч"
                        >
                          →
                        </button>
                      )}
                      <button type="button" className="task-card-button" onClick={() => openTaskDetails(task)}>
                        Змінити
                      </button>
                      <button
                        type="button"
                        className="task-card-button"
                        onClick={() => void handleDeleteTask(task.task_id)}
                      >
                        Вилучити
                      </button>
                    </div>
                  </article>
                ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
