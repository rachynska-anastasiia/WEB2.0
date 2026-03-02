import { Router } from "express";
import { pool } from "../db";

const router = Router();

// CREATE
router.post("/", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1,$2,$3) RETURNING *",
      [name, email, password]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Error creating user" });
  }
});

// READ ALL
router.get("/", async (req, res) => {
  const result = await pool.query("SELECT * FROM users");
  res.json(result.rows);
});

// READ ONE
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  const result = await pool.query(
    "SELECT * FROM users WHERE id = $1",
    [id]
  );

  res.json(result.rows[0]);
});

// UPDATE
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  const result = await pool.query(
    "UPDATE users SET name=$1, email=$2 WHERE id=$3 RETURNING *",
    [name, email, id]
  );

  res.json(result.rows[0]);
});

// DELETE
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  await pool.query("DELETE FROM users WHERE id=$1", [id]);
  res.json({ message: "User deleted" });
});

export default router;