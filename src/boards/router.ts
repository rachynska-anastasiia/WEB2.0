import { Router } from "express";
import { BoardsService } from "./service";

const router = Router();

// GET all boards
router.get("/", async (req, res) => {
  const boards = await BoardsService.getAll();
  res.json(boards);
});

// GET board by id
router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const board = await BoardsService.getById(id);
  res.json(board);
});

// CREATE board
router.post("/", async (req, res) => {
  const board = await BoardsService.create(req.body);
  res.status(201).json(board);
});

// UPDATE board
router.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const board = await BoardsService.update(id, req.body);
  res.json(board);
});

// DELETE board
router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const board = await BoardsService.delete(id);
  res.json(board);
});

export default router;