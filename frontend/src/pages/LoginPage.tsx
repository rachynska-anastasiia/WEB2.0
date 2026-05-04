import { Link } from "react-router-dom";

export default function LoginPage() {
  return (
    <main className="page page-login">
      <h1>Вхід</h1>
      <form>
        <input type="email" placeholder="Email" required autoComplete="email" />
        <button type="submit">Вхід</button>
        <p className="hint">
          Немає акаунта? <Link to="/register">Зареєструватися</Link>
        </p>
      </form>
    </main>
  );
}
