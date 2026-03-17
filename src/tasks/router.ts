import { Router } from "express";
import { Request, Response } from "express";
//import { AuthRequest } from "../middleware/auth";
import { TasksService } from "./service";
import { AppError } from "../errorHandler/service";
import { authMiddleware } from "../middleware/auth";

export const todoRoutes = Router();
const service = new TasksService();

/*todoRoutes.get("/GetAllTasks", async (req: Request, res: Response) => {
    const result = await service.GetAllTasks();
    return res.status(200).json(result);
});*/

todoRoutes.post("/addTask", authMiddleware, async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const {title, description} = req.body;
    if (!title) {
        throw new AppError(401, "Title is required");
    }
    if(!description){
        throw new AppError(401, "Description is required");
    }
    const result = await service.AddTask(userId, {title, description});
    return res.status(200).json(result);
});

todoRoutes.get("/GetTaskByTitle/:title", authMiddleware, async (req: Request, res) => {
    const userId = req.user!.userId;
    const title = req.params.title as string;
    if (!title) {
        throw new AppError(401, "No title provided");
    }
    const result = await service.GetTaskByTitle(userId, { title });
    return res.status(200).json(result);
});

todoRoutes.get("/GetTaskByPriority/:priority", authMiddleware, async (req: Request, res) => {
    const userId = req.user!.userId;
    const priority = req.params.priority as string;
    if (!priority) {
        throw new AppError(401, "No priority provided");
    }
    const result = await service.GetTaskByPriority(userId, {priority});
    return res.status(200).json(result);
});

todoRoutes.put("/UpdateTaskTitle", authMiddleware, async (req: Request, res) => {
    const userId = req.user!.userId;
    const {task_id, title} = req.body;
    if (!task_id) {
        throw new AppError(401, "No task_id provided");
    }
    if (!title) {
        throw new AppError(401, "No title provided");
    }
    const result = await service.UpdateTaskTitle(userId, {task_id, title});
    return res.status(200).json(result);
});

todoRoutes.put("/UpdateTaskPriority", authMiddleware, async (req: Request, res) => {
    const userId = req.user!.userId;
    const {task_id, priority} = req.body;
    if (!task_id) {
        throw new AppError(401, "No task_id provided");
    }
    if (!priority) {
        throw new AppError(401, "No priority provided");
    }
    const result = await service.UpdateTaskPriority(userId, {task_id, priority});
    return res.status(200).json(result);
});

todoRoutes.put("/UpdateTaskDescription", authMiddleware, async (req: Request, res) => {
    const userId = req.user!.userId;
    const {task_id, description} = req.body;
    if (!task_id) {
        throw new AppError(401, "No task_id provided");
    }
    if (!description) {
        throw new AppError(401, "No description provided");
    }
    const result = await service.UpdateTaskDescription(userId, {task_id, description});
    return res.status(200).json(result);
});

todoRoutes.put("/UpdateTaskDedline", authMiddleware, async (req: Request, res) => {
    const userId = req.user!.userId;
    const {task_id, due_date} = req.body;
    if (!task_id) {
        throw new AppError(401, "No task_id provided");
    }
    if (!due_date) {
        throw new AppError(401, "No due_date provided");
    }
    const result = await service.UpdateTaskDedline(userId, {task_id, due_date});
    return res.status(200).json(result);
});

todoRoutes.delete("/deleteTask", authMiddleware, async (req: Request, res) => {
    const userId = req.user!.userId;
    const { task_id } = (req.body || {}) as { task_id?: number };
    if (!task_id) {
        throw new AppError(401, "No task_id provided");
    }
    const result = await service.deleteTask(userId, {task_id});
    return res.status(200).json(result);

});

export default todoRoutes;