import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getJob, getJobResult, type JobStatus } from "../api/jobs";

const STATUS_UA: Record<JobStatus, string> = {
  CREATED: "Створено",
  PROCESSING: "В обробці",
  DONE: "Готово",
  ERROR: "Помилка",
};

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const jobId = Number(id);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<JobStatus | null>(null);
  const [result, setResult] = useState<unknown>(null);
  const hasTitle = Boolean(title);
  const hasStatus = status;
  const hasResult = result;

  useEffect(() => {
    if (!Number.isFinite(jobId) || jobId < 1) return;
    let cancelled = false;

    (async () => {
      const job = await getJob(jobId);
      if (cancelled) return;

      setTitle(job.title);
      setStatus(job.status);

      if (job.status === "DONE") {
        const data = await getJobResult(jobId);
        if (!cancelled) setResult(data);
      }
    })();

    return () => { cancelled = true;};
  }, [jobId]);

  return (
    <main className="page page-jobs">
      <p className="jobs-back"> <Link to="/jobs" className="jobs-link"> &lt; До списку</Link> </p>
      <h1>Результат звіту</h1>
      {hasTitle && <p className="hint">{title}</p>}
      {hasStatus && (
        <p>
          <span className={`job-status job-status--${status.toLowerCase()}`}>{STATUS_UA[status]}</span>
        </p>
      )}
      {hasResult && <pre className="jobs-result">{JSON.stringify(result, null, 2)}</pre>}
    </main>
  );
}
