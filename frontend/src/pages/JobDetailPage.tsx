import { Link } from "react-router-dom";
import { MOCK_JOB_RESULTS } from "./JobsPage";

export default function JobDetailPage() {

  return (
    <main className="page page-jobs">
      <p className="jobs-back"> <Link to="/jobs" className="jobs-link"> &lt; До списку</Link> </p>
      <h1>Результат звіту</h1>
      <pre className="jobs-result">{JSON.stringify(MOCK_JOB_RESULTS[1], null, 2)}</pre>
    </main>
  );
}
