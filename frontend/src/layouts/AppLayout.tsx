import { NavLink, Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <div className="app-shell">
      <header className="app-header">
      <NavLink to="/main" className="app-title nav-link" end>Баг-трекер «Канбанчик»</NavLink>
      <nav className="app-nav">
        <NavLink to="/tasks" className="nav-link" end>Таски</NavLink>
        <NavLink to="/jobs" className="nav-link">Звіт по успішності</NavLink>
        <NavLink to="/login" className="nav-link">Профіль</NavLink>
      </nav>
      </header>
      <Outlet />
    </div>
  );
}
