import { type FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/users";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      setError(null);
      await registerUser(name.trim(), email.trim());
      navigate("/login");
    } catch (err) {
      navigate("/error");
    }
  }

  return (
    <main className="page page-register">
      <h1>Реєстрація</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Імʼя"
          required
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">Створити обліковий запис</button>
        {error && <p className="jobs-error">{error}</p>}
      </form>
      <p className="hint">Вже є акаунт? <Link to="/login">Увійти</Link> </p>
    </main>
  );
}
