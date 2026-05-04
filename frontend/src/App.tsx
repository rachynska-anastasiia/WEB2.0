import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import JobsPage from "./pages/JobsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import TasksPage from "./pages/TasksPage";
import MainPage from "./pages/MainPage";
import ErrorPage from "./pages/ErrorPage";
import OneTaskPage from "./pages/OneTaskPage";
import JobDetailPage from "./pages/JobDetailPage.tsx";
import "./App.css";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<AppLayout />}>
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/error" element={<ErrorPage />} />
        <Route path="/one-task" element={<OneTaskPage />} />
        <Route path="/jobs/:id" element={<JobDetailPage />} />
      </Route>

      <Route path="/" element={<Navigate to="/main" replace />} />
    </Routes>
  );
}
