import { type FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api/users";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      setError(null);
      await loginUser(email.trim());
      navigate("/tasks");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не вдалося увійти");
    }
  }

  return (
    <main className="page page-login">
      <h1>Вхід</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">Вхід</button>
        {error && <p className="jobs-error">{error}</p>}
        <p className="hint">
          Немає акаунта? <Link to="/register">Зареєструватися</Link>
        </p>
      </form>
    </main>
  );
}
