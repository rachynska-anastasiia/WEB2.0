import { type FormEvent, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  type TaskPriority,
  type TaskRow,
  updateTaskDeadline,
  updateTaskDescription,
  updateTaskPriority,
  updateTaskTitle,
} from "../api/tasks";

type LocationState = {
  task?: TaskRow;
};

export default function OneTaskPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;
  const task = state?.task;

  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [dueDate, setDueDate] = useState(task?.due_date ?? "");
  const [priority, setPriority] = useState<TaskPriority>(task?.priority ?? "low");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!task) return;

    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();
    const trimmedDueDate = dueDate.trim();

    if (!trimmedTitle) {
      setError("Назва задачі не може бути порожньою");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (trimmedTitle !== task.title) 
        await updateTaskTitle(task.task_id, trimmedTitle);

      if (trimmedDescription !== (task.description ?? "")) 
        await updateTaskDescription(task.task_id, trimmedDescription);

      if (priority !== task.priority)
        await updateTaskPriority(task.task_id, priority);

      if (trimmedDueDate && trimmedDueDate !== (task.due_date ?? ""))
        await updateTaskDeadline(task.task_id, trimmedDueDate);

      navigate("/tasks");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не вдалося зберегти зміни");
    } finally {
      setLoading(false);
    }
  }

  if (!task) {
    return (
      <main className="page">
        <h1>Редагування задачі</h1>
        <p>Не вдалося відкрити задачу. Поверніться до списку та натисніть "Змінити" ще раз.</p>
        <button type="button" onClick={() => navigate("/tasks")}>
          Назад до задач
        </button>
      </main>
    );
  }

  return (
    <main className="page">
      <h1>Редагування задачі</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="text"
          placeholder="YYYY-MM-DD"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <select value={priority} onChange={(e) => setPriority(e.target.value as TaskPriority)}>
          <option value="low">Низький</option>
          <option value="medium">Середній</option>
          <option value="high">Високий</option>
        </select>
        {error && <p className="tasks-form-error">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "Збереження" : "Зберегти"}
        </button>
      </form>
    </main>
  );
}