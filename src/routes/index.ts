import { Router } from "express";
import authRoutes from "./auth";
import todoRoutes from "../concrete_board/router";
import taskRoutes from "../tasks/router";

const router = Router();

router.use("/auth", authRoutes);
router.use("/todos", todoRoutes);
router.use("/tasks", taskRoutes);

export default router;