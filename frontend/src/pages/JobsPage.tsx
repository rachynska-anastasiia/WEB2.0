import { type FormEvent, useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  createJob,
  getJobs,
  type JobRow,
  type JobSocketMessage,
} from "../api/jobs";
import {
  JobsWebSocketClient,
  type WebSocketConnectionState,
} from "../realtime/wsClient";

type LiveStatus = "connected" | "reconnecting" | "offline";

function getStatusTitle(status: JobRow["status"]): string {
  if (status === "CREATED") return "Створено";
  if (status === "PROCESSING") return "В обробці";
  if (status === "DONE") return "Готово";
  if (status === "ERROR") return "Помилка";
  return status;
}

function getLiveStatus(state: WebSocketConnectionState): LiveStatus {
  if (state === "open") return "connected";
  if (state === "connecting" || state === "reconnecting") return "reconnecting";
  return "offline";
}

function applySocketMessage(jobs: JobRow[], msg: JobSocketMessage): JobRow[] {
  if (!msg.jobId) return jobs;

  return jobs.map((job) => {
    if (job.id !== msg.jobId) return job;

    return {
      ...job,
      status: msg.status ?? job.status,
      error: msg.error ?? job.error,
      s3_key: msg.s3_key ?? job.s3_key,
      updated_at: msg.at ?? job.updated_at,
    };
  });
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<JobRow[]>([]);
  const [title, setTitle] = useState("Звіт по успішності тасків");
  const [liveStatus, setLiveStatus] = useState<LiveStatus>("offline");
  const [wsOpen, setWsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadJobs = useCallback(async () => {
    try {
      setError(null);
      const rows = await getJobs();
      setJobs(rows);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не вдалося завантажити звіти");
    }
  }, []);

  useEffect(() => {
    void loadJobs();
  }, [loadJobs]);

  useEffect(() => {
    const ws = new JobsWebSocketClient({
      onStateChange: (state) => {
        setLiveStatus(getLiveStatus(state));
        setWsOpen(state === "open");
      },
    });

    const unsubscribe = ws.subscribe((msg) => {
      if (msg.type === "connected") return;

      setJobs((prev) => applySocketMessage(prev, msg));

      if (msg.type === "completion") {
        void loadJobs();
      }
    });

    ws.connect();

    return () => {
      unsubscribe();
      ws.disconnect();
    };
  }, [loadJobs]);

  useEffect(() => {
    if (wsOpen) return;

    const pollingId = setInterval(() => {
      void loadJobs();
    }, 5000);

    return () => clearInterval(pollingId);
  }, [wsOpen, loadJobs]);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();

    const newTitle = title.trim();
    if (!newTitle) return;

    try {
      setError(null);
      await createJob(newTitle);
      setTitle("Звіт по успішності тасків");
      await loadJobs();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не вдалося створити звіт");
    }
  }

  return (
    <main className="page page-jobs">
      <h1>Звіти</h1>

      <p className="hint">Live: {liveStatus}</p>
      {!wsOpen && <p className="hint">Fallback: REST polling активний</p>}
      {error && <p className="jobs-error">{error}</p>}

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

          <button type="submit" className="jobs-generate-button">
            Згенерувати звіт
          </button>
        </form>
      </section>

      <section className="jobs-list-section">
        <div className="jobs-list-head">
          <h2 className="jobs-section-title">Список звітів</h2>
          <button type="button" className="jobs-refresh" onClick={() => void loadJobs()}>
            Оновити
          </button>
        </div>

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
                  <td className="jobs-table-date">
                    {new Date(job.updated_at).toLocaleString("uk-UA")}
                  </td>
                  <td>
                    <Link to={`/jobs/${job.id}`} className="jobs-link">
                      Деталі
                    </Link>
                  </td>
                </tr>
              ))}

              {jobs.length === 0 && (
                <tr>
                  <td colSpan={5}>Звітів ще немає</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}