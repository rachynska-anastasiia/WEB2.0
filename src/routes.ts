import { Router } from "express";
//import authRoutes from "./auth";
import { todoRoutes } from "./concrete_board/router";

const router = Router();

//router.use("/auth", authRoutes);
router.use("/todos", todoRoutes);

export default router;