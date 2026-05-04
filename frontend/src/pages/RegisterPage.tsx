import { Link } from "react-router-dom";

export default function RegisterPage() {
  return (
    <main className="page page-register">
      <h1>Реєстрація</h1>
      <form>
        <input type="text" name="name" placeholder="Імʼя" required autoComplete="name" />
        <input type="email" name="email" placeholder="Email" required autoComplete="email"/>
        <button type="submit">Створити обліковий запис</button>
      </form>
      <p className="hint">Вже є акаунт? <Link to="/login">Увійти</Link> </p>
    </main>
  );
}
