import { Router } from "express";
import { UsersService } from "./service";

const router = Router();

router.get("/", async (req, res) => {
  const users = await UsersService.getAll();
  res.json(users);
});

router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const user = await UsersService.getById(id);
  res.json(user);
});

router.post("/", async (req, res) => {
  const user = await UsersService.create(req.body);
  res.status(201).json(user);
});

router.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const user = await UsersService.update(id, req.body);
  res.json(user);
});

router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const user = await UsersService.delete(id);
  res.json(user);
});

export default router;