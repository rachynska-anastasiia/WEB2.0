import { useState } from "react";

type ColumnId = "todo" | "doing" | "done";
type Priority = "low" | "medium" | "high";

type TaskTile = {
  id: number;
  title: string;
  priority: Priority;
  column: ColumnId;
};


const PRIORITY_MAP: Record<Priority, string> = {
  low: "Низький",
  medium: "Середній",
  high: "Високий",
};

const MOCK_TASKS: TaskTile[] = [
  { id: 1, title: "Налаштувати", priority: "low", column: "todo" },
  { id: 3, title: "Ендпоінт списку jobs", priority: "medium", column: "doing" },
  { id: 5, title: "Міграція БД", priority: "high", column: "done" },
];

function titleMatches(task: TaskTile, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return task.title.toLowerCase().includes(q) || PRIORITY_MAP[task.priority].toLowerCase().includes(q);
}

const COLUMNS: { id: ColumnId; title: string }[] = [
  { id: "todo", title: "Нові" },
  { id: "doing", title: "В роботі" },
  { id: "done", title: "Готово" },
];

function buttons(col: ColumnId) {
  switch (col) {
    case "todo":
      return (
        <>
          <button className="task-card-button">Змінити</button>
          <button className="task-card-button">Вилучити</button>
          <button className="task-card-button">&gt;</button>
        </>
      );
    case "doing":
      return (
        <>
          <button className="task-card-button">&lt;</button>
          <button className="task-card-button">Змінити</button>
          <button className="task-card-button">Вилучити</button>
          <button className="task-card-button">&gt;</button>
        </>
      );
    case "done":
      return (
        <>
          <button className="task-card-button">&lt;</button>
          <button className="task-card-button">Змінити</button>
          <button className="task-card-button">Вилучити</button>
        </>
      );
    }
  }

export default function TasksPage() {
  const [search, setSearch] = useState("");
  const visibleTasks = MOCK_TASKS.filter(t => titleMatches(t, search));

  return (
    <main className="page page-tasks">
      <h1>Таски</h1>

      <div className="tasks-search-container">
        <input type="search"
          className="tasks-search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Пошук за назвою"
        />
        <button>Додати завдання</button>        
      </div>

      <div className="board">
        {COLUMNS.map((col) => (
          <section key={col.id} className="board-column">

            <h2 className="board-column-title">{col.title}</h2>

            <div className="board-column-cards">
              {visibleTasks.filter((t) => t.column === col.id).map((task) => (
                <article key={task.id} className="task-card">

                  <h3 className="task-card-title">{task.title}</h3>
                  <p className="task-card-meta">#{task.id}</p>
                  <p className="task-card-meta task-priority-row">
                    <span className={`task-priority-dot task-priority-dot--${task.priority}`}/>
                    <span>{PRIORITY_MAP[task.priority]}</span>
                  </p>

                  <div className="task-card-buttons">{buttons(col.id)}</div>
                </article>
              ))}
            </div>

          </section>
        ))}
      </div>
    </main>
  );
}
