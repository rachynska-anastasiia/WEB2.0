import { Router } from "express";
import { register } from "node:module";
const authRoutes = Router();

authRoutes.post("/register", () => {});
authRoutes.post("/login", () => {});
authRoutes.get("/profile", () => {});

export default authRoutes;