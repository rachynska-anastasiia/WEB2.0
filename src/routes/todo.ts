import { Router } from "express";
import {pool} from "../db";
import { AuthRequest } from "../middleware/auth";
const todoRoutes = Router();

todoRoutes.post("/addBoard", async (req: AuthRequest, res) => {
    const {title} = req.body;
    const userId = req.user?.userId;
    if (!userId) {
        return res.status(401).json({message: "Unauthorized"});
    }
    const result = await pool.query("INSERT INTO todos (title, user_id) VALUES ($1, $2) RETURNING *", [title, userId]);
    res.json(result.rows[0]);
});

todoRoutes.get("/getBoard", async (req: AuthRequest, res) => {
    const userId = req.user?.userId;
    if (!userId) {
        return res.status(401).json({message: "Unauthorized"});
    }
    const result = await pool.query("SELECT * FROM todos WHERE user_id = $1", [userId]);
    res.json(result.rows);
});

todoRoutes.put("/:id", async (req: AuthRequest, res) => {
    const {id} = req.params;
    const {title} = req.body;
    const userId = req.user?.userId;
    if (!userId) {
        return res.status(401).json({message: "Unauthorized"});
    }
    const result = await pool.query("UPDATE todos SET title = $1 WHERE id = $2 AND user_id = $3", [title, id, userId]);
    res.json(result.rows[0]);
});

todoRoutes.delete("/:id", async (req: AuthRequest, res) => {
    const {id} = req.params;
    const userId = req.user?.userId;
    if (!userId) {
        return res.status(401).json({message: "Unauthorized"});
    }
    const result = await pool.query("DELETE FROM todos WHERE id = $1 AND user_id = $2", [id, userId]);
    res.json(result.rows[0]);
});

export default todoRoutes;