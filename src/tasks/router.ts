import { Router } from "express";
import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { TasksService } from "./service";

export const todoRoutes = Router();
const service = new TasksService();

todoRoutes.post("/addTask", async (req: Request, res: Response) => {
    const {title, description} = req.body;
    //const userId = req.user?.userId;
    if (!title) {
        return res.status(401).json({message: "Unauthorized"});
    }
    if(!description){
        return res.status(401).json({message: "Unauthorized"});
    }
    return service.AddTask({title, description});
});

todoRoutes.get("/GetTaskByTitle/:title", async (req: Request, res) => {
    const title = req.params.title as string;
    if (!title) {
        return res.status(401).json({message: "Unauthorized"});
    }
    return service.GetTaskByTitle({ title });
});

todoRoutes.get("/GetTaskByPriority/:priority", async (req: Request, res) => {
    const priority = req.params.priority as string;
    if (!priority) {
        return res.status(401).json({message: "Unauthorized"});
    }
    return service.GetTaskByPriority({priority});
});

todoRoutes.put("/UpdateTaskTitle", async (req: AuthRequest, res) => {
    const {task_id, title} = req.body;
    if (!task_id) {
        return res.status(401).json({message: "Unauthorized"});
    }
    if (!title) {
        return res.status(401).json({message: "Unauthorized"});
    }
    return service.UpdateTaskTitle({task_id, title});
});

todoRoutes.put("/UpdateTaskPriority", async (req: AuthRequest, res) => {
    const {task_id, priority} = req.body;
    if (!task_id) {
        return res.status(401).json({message: "Unauthorized"});
    }
    if (!priority) {
        return res.status(401).json({message: "Unauthorized"});
    }
    return service.UpdateTaskPriority({task_id, priority});
});

todoRoutes.put("/UpdateTaskDescription", async (req: AuthRequest, res) => {
    const {task_id, description} = req.body;
    if (!task_id) {
        return res.status(401).json({message: "Unauthorized"});
    }
    if (!description) {
        return res.status(401).json({message: "Unauthorized"});
    }
    return service.UpdateTaskDescription({task_id, description});
});

todoRoutes.put("/UpdateTaskDedline", async (req: AuthRequest, res) => {
    const {task_id, due_date} = req.body;
    if (!task_id) {
        return res.status(401).json({message: "Unauthorized"});
    }
    if (!due_date) {
        return res.status(401).json({message: "Unauthorized"});
    }
    return service.UpdateTaskDedline({task_id, due_date});
});

todoRoutes.delete("/deleteTask", async (req: Request, res) => {
    const task_id = req.body;
    if (!task_id) {
        return res.status(401).json({message: "Unauthorized"});
    }
    return service.deleteTask({task_id});

});

export default todoRoutes;