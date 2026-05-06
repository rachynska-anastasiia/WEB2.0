import { Router } from "express";
import { Request, Response } from "express";
//import { AuthRequest } from "../middleware/auth";
import { TasksService } from "./service";
import { AppError } from "../errorHandler/service";
//import { authMiddleware } from "../middleware/auth";

export const todoRoutes = Router();
const service = new TasksService();

todoRoutes.get("/", async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const result = await service.GetAllTasks(userId);
    return res.status(200).json(result);
});

todoRoutes.post("/addTask", async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const {title, description} = req.body;
    const result = await service.AddTask(userId, {title, description});
    return res.status(200).json(result);
});

todoRoutes.get("/GetTaskByTitle/:title", async (req: Request, res) => {
    const userId = req.user!.userId;
    const title = req.params.title as string;
    const result = await service.GetTaskByTitle(userId, { title });
    return res.status(200).json(result);
});

todoRoutes.get("/GetTaskByPriority/:priority", async (req: Request, res) => {
    const userId = req.user!.userId;
    const priority = req.params.priority as string;
    const result = await service.GetTaskByPriority(userId, {priority});
    return res.status(200).json(result);
});

todoRoutes.put("/UpdateTaskTitle", async (req: Request, res) => {
    const userId = req.user!.userId;
    const {task_id, title} = req.body;
    const result = await service.UpdateTaskTitle(userId, {task_id, title});
    return res.status(200).json(result);
});

todoRoutes.put("/UpdateTaskPriority", async (req: Request, res) => {
    const userId = req.user!.userId;
    const {task_id, priority} = req.body;
    const result = await service.UpdateTaskPriority(userId, {task_id, priority});
    return res.status(200).json(result);
});

todoRoutes.put("/UpdateTaskDescription", async (req: Request, res) => {
    const userId = req.user!.userId;
    const {task_id, description} = req.body;
    const result = await service.UpdateTaskDescription(userId, {task_id, description});
    return res.status(200).json(result);
});

todoRoutes.put("/UpdateTaskDedline", async (req: Request, res) => {
    const userId = req.user!.userId;
    const {task_id, due_date} = req.body;
    const result = await service.UpdateTaskDedline(userId, {task_id, due_date});
    return res.status(200).json(result);
});

todoRoutes.delete("/deleteTask", async (req: Request, res) => {
    const userId = req.user!.userId;
    const { task_id } = (req.body || {}) as { task_id?: number };
    if (!task_id) {
        throw new AppError(400, "No task_id provided");
    }
    const result = await service.deleteTask(userId, {task_id});
    return res.status(200).json(result);

});

export default todoRoutes;