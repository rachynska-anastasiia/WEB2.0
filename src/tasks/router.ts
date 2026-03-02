import { Router } from "express";
import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { TasksService } from "./service";

export const todoRoutes = Router();
const service = new TasksService();

todoRoutes.get("/GetAllTasks", async (req: Request, res: Response) => {
    const result = await service.GetAllTasks();
    return res.status(200).json(result);
});

todoRoutes.post("/addTask", async (req: Request, res: Response) => {
    const {title, description} = req.body;
    //const userId = req.user?.userId;
    if (!title) {
        return res.status(401).json({message: "Unauthorized"});
    }
    if(!description){
        return res.status(401).json({message: "Description is required"});
    }
    const result = await service.AddTask({title, description});
    return res.status(200).json(result);
});

todoRoutes.get("/GetTaskByTitle/:title", async (req: Request, res) => {
    const title = req.params.title as string;
    if (!title) {
        return res.status(401).json({message: "No title provided"});
    }
    const result = await service.GetTaskByTitle({ title });
    return res.status(200).json(result);
});

todoRoutes.get("/GetTaskByPriority/:priority", async (req: Request, res) => {
    const priority = req.params.priority as string;
    if (!priority) {
        return res.status(401).json({message: "No priority provided"});
    }
    const result = await service.GetTaskByPriority({priority});
    return res.status(200).json(result);
});

todoRoutes.put("/UpdateTaskTitle", async (req: AuthRequest, res) => {
    const {task_id, title} = req.body;
    if (!task_id) {
        return res.status(401).json({message: "No task_id provided"});
    }
    if (!title) {
        return res.status(401).json({message: "No title provided"});
    }
    const result = await service.UpdateTaskTitle({task_id, title});
    return res.status(200).json(result);
});

todoRoutes.put("/UpdateTaskPriority", async (req: AuthRequest, res) => {
    const {task_id, priority} = req.body;
    if (!task_id) {
        return res.status(401).json({message: "No task_id provided"});
    }
    if (!priority) {
        return res.status(401).json({message: "No priority provided"});
    }
    const result = await service.UpdateTaskPriority({task_id, priority});
    return res.status(200).json(result);
});

todoRoutes.put("/UpdateTaskDescription", async (req: AuthRequest, res) => {
    const {task_id, description} = req.body;
    if (!task_id) {
        return res.status(401).json({message: "No task_id provided"});
    }
    if (!description) {
        return res.status(401).json({message: "No description provided"});
    }
    const result = await service.UpdateTaskDescription({task_id, description});
    return res.status(200).json(result);
});

todoRoutes.put("/UpdateTaskDedline", async (req: AuthRequest, res) => {
    const {task_id, due_date} = req.body;
    if (!task_id) {
        return res.status(401).json({message: "No task_id provided"});
    }
    if (!due_date) {
        return res.status(401).json({message: "No due_date provided"});
    }
    const result = await service.UpdateTaskDedline({task_id, due_date});
    return res.status(200).json(result);
});

todoRoutes.delete("/deleteTask", async (req: Request, res) => {
    const { task_id } = (req.body || {}) as { task_id?: number };
    if (!task_id) {
        return res.status(401).json({message: "No task_id provided"});
    }
    const result = await service.deleteTask({task_id});
    return res.status(200).json(result);

});

export default todoRoutes;