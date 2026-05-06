import { type FormEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { createJob, getJobs, type JobRow } from "../api/jobs";

function getStatusTitle(status: JobRow["status"]): string {
  if (status === "CREATED") return "Створено";
  if (status === "PROCESSING") return "В обробці";
  if (status === "DONE") return "Готово";
  if (status === "ERROR") return "Помилка";
  return status;
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<JobRow[]>([]);
  const [title, setTitle] = useState("Звіт по успішності тасків");

  async function loadJobs() {
    setJobs(await getJobs());
  }

  useEffect(() => { void loadJobs(); }, []);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    const t = title.trim();
    if (!t) return;
    await createJob(t);
    setTitle("Звіт по успішності тасків");
    await loadJobs();
  }

  return (
    <main className="page page-jobs">
      <h1>Звіти</h1>

      <section className="jobs-create">
        <form className="jobs-create-form" onSubmit={handleCreate}>
          <label className="jobs-field">
            <input
              placeholder="Назва звіту"
              required
              maxLength={500}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
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
                      {getStatusTitle(job.status)}
                    </span>
                  </td>
                  <td className="jobs-table-date">{new Date(job.updated_at).toLocaleString("uk-UA")}</td>
                  <td><Link to={`/jobs/${job.id}`} className="jobs-link">Деталі</Link></td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>

      </section>
    </main>
  );
}
