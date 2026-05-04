import { Link } from "react-router-dom";

export type JobStatus = "CREATED" | "PROCESSING" | "DONE" | "ERROR";

export type JobRow = {
  id: number;
  user_id: number;
  title: string;
  status: JobStatus;
  idempotency_key: string;
  error: string | null;
  created_at: string;
  updated_at: string;
  s3_key: string | null;
};

const STATUS_UA: { status: JobStatus; title: string }[] = [
  { status: "CREATED", title: "Створено" },
  { status: "PROCESSING", title: "В обробці" },
  { status: "DONE", title: "Готово" },
  { status: "ERROR", title: "Помилка" },
];


export const INITIAL_MOCK_JOBS: JobRow[] = [
  {
    id: 1,
    user_id: 1,
    title: "Звіт по успішності тасків",
    status: "DONE",
    idempotency_key: "demo-1",
    error: null,
    created_at: "2026-05-01T10:00:00.000Z",
    updated_at: "2026-05-01T10:02:00.000Z",
    s3_key: "demo/report-1.json",
  }
];

export const MOCK_JOB_RESULTS: Record<number, unknown> = {
  1: {
    jobType: "task_stats",
    countsByStatus: { CREATED: 2, PROCESSING: 1, DONE: 5, ERROR: 0 },
    generatedAt: "2026-05-01T10:02:00.000Z",
  },
};


export default function JobsPage() {
  const jobs = INITIAL_MOCK_JOBS;

  return (
    <main className="page page-jobs">
      <h1>Звіти</h1>

      <section className="jobs-create">
        <form className="jobs-create-form">
          <label className="jobs-field">
            <input placeholder="Назва звіту" required maxLength={500} />
          </label>
          <button type="submit" className="jobs-generate-button"> Згенерувати звіт </button>
        </form>
      </section>

      <section className="jobs-list-section">
          <h2 className="jobs-section-title">Список звітів</h2>

        <div className="jobs-table-wrap">
          <table className="jobs-table">

            <thead>
              <tr>
                <th>ID</th>
                <th>Назва</th>
                <th>Статус</th>
                <th>Оновлено</th>
                <th>Деталі</th>
              </tr>
            </thead>

            <tbody>
              {jobs.map((job) => (
                <tr key={job.id}>
                  <td>{job.id}</td>
                  <td>{job.title}</td>
                  <td>
                    <span className={`job-status job-status--${job.status.toLowerCase()}`}>
                      {STATUS_UA[job.status]}
                    </span>
                  </td>
                  <td className="jobs-table-date">{new Date(job.updated_at).toLocaleString("uk-UA")}</td>
                  <td><Link to={`/jobs/${job.id}`} state={{ job }} className="jobs-link">Деталі</Link></td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>

      </section>
    </main>
  );
}
