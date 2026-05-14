import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getJob, getJobResult, type JobRow, type JobStatus } from "../api/jobs";
import { JobsWebSocketClient } from "../realtime/wsClient";
import type { WebSocketConnectionState } from "../realtime/wsClient";

type LiveStatus = "connected" | "reconnecting" | "offline";

const STATUS_UA: Record<JobStatus, string> = {
  CREATED: "Створено",
  PROCESSING: "В обробці",
  DONE: "Готово",
  ERROR: "Помилка",
};
 
function getLiveStatus(state: WebSocketConnectionState): LiveStatus {
  if (state === "open") return "connected";
  if (state === "connecting" || state === "reconnecting") return "reconnecting";
  return "offline";
}

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const jobId = Number(id);

  const [job, setJob] = useState<JobRow | null>(null);
  const [result, setResult] = useState<unknown>(null);
  const [liveStatus, setLiveStatus] = useState<LiveStatus>("offline");
  const [wsOpen, setWsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadJob = useCallback(async () => {
    if (!Number.isFinite(jobId) || jobId < 1) return;

    try {
      setError(null);

      const jobRow = await getJob(jobId);
      setJob(jobRow);

      if (jobRow.status === "DONE") {
        const data = await getJobResult(jobId);
        setResult(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не вдалося завантажити звіт");
    }
  }, [jobId]);

  useEffect(() => {
    void loadJob();
  }, [loadJob]);

  useEffect(() => {
    if (!Number.isFinite(jobId) || jobId < 1) return;

    let active = true;

    const ws = new JobsWebSocketClient({
      onStateChange: (state) => {
        if (!active) return;

        setLiveStatus(getLiveStatus(state));
        setWsOpen(state === "open");
      },
    });

    const unsubscribe = ws.subscribe((msg) => {
      if (!active || msg.jobId !== jobId) return;
      if (msg.type === "connected") return;

      setJob((currentJob) => {
        if (!currentJob) return currentJob;

        return {
          ...currentJob,
          status: msg.status ?? currentJob.status,
          error: msg.error ?? currentJob.error,
          s3_key: msg.s3_key ?? currentJob.s3_key,
          updated_at: msg.at ?? currentJob.updated_at,
        };
      });

      if ((msg.type === "completion" || msg.status === "DONE") && msg.success !== false) {
        void getJobResult(jobId).then((data) => {
            if (active) setResult(data);
          }).catch((err) => {
            if (active)
              setError(err instanceof Error ? err.message : "Не вдалося отримати результат");
          });
      }
    });

    ws.connect();

    return () => {
      active = false;
      unsubscribe();
      ws.disconnect();
    };
  }, [jobId]);

  useEffect(() => {
    if (wsOpen) return;

    const pollingId = setInterval(() => {
      void loadJob();
    }, 5000);

    return () => clearInterval(pollingId);
  }, [wsOpen, loadJob]);

  return (
    <main className="page page-jobs">
      <p className="jobs-back">
        <Link to="/jobs" className="jobs-link">
          &lt; До списку
        </Link>
      </p>

      <h1>Результат звіту</h1>

      <p className="hint">Live: {liveStatus}</p>
      {!wsOpen && <p className="hint">Fallback: REST polling активний</p>}

      {error && <pre className="jobs-result jobs-result--error">{error}</pre>}

      {job && (
        <section className="jobs-result-block">
          <p className="hint">{job.title}</p>

          <p>
            <span className={`job-status job-status--${job.status.toLowerCase()}`}>
              {STATUS_UA[job.status]}
            </span>
          </p>

          {job.status !== "DONE" && job.status !== "ERROR" && (
            <p className="hint">Звіт ще обробляється. Сторінка оновлює статус автоматично.</p>
          )}

          {job.status === "ERROR" && (
            <pre className="jobs-result jobs-result--error">
              {job.error || "Помилка генерації звіту"}
            </pre>
          )}

          {result !== null && (
            <pre className="jobs-result">
              {JSON.stringify(result, null, 2)}
            </pre>
          )}
        </section>
      )}
    </main>
  );
}