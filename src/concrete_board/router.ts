import { Router } from "express";
import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { ConcreteBoardService } from "./service";

export const todoRoutes = Router();
const service = new ConcreteBoardService();

todoRoutes.post("/addTaskToBoard", async (req: Request, res: Response) => {
    const {user_id, task_id} = req.body;
    //const userId = req.user?.userId;
    if (!user_id) {
        return res.status(401).json({message: "Unauthorized"});
    }
    if(!task_id){
        return res.status(401).json({message: "Unauthorized"});
    }
    return service.addTaskToBoard({user_id, task_id});
});

todoRoutes.get("/GetTaskOnBoardByTag/:tag", async (req: Request, res) => {
    const tag = req.params.tag as string;
    if (!tag) {
        return res.status(401).json({message: "Unauthorized"});
    }
    return service.GetTaskOnBoardByTag({ tag });
});

todoRoutes.get("/GetTaskOnBoardByPriority/:priority", async (req: Request, res) => {
    const priority = req.params.priority as string;
    if (!priority) {
        return res.status(401).json({message: "Unauthorized"});
    }
    return service.GetTaskOnBoardByPriority({priority});
});

todoRoutes.put("/updateTaskTagOnBoard", async (req: AuthRequest, res) => {
    const {board_tasks_id, tag} = req.body;
    if (!board_tasks_id) {
        return res.status(401).json({message: "Unauthorized"});
    }
    if (!tag) {
        return res.status(401).json({message: "Unauthorized"});
    }
    return service.updateTaskTagOnBoard({board_tasks_id, tag});
});

todoRoutes.put("/updateTaskPriorityOnBoard", async (req: AuthRequest, res) => {
    const {board_tasks_id, priority} = req.body;
    if (!board_tasks_id) {
        return res.status(401).json({message: "Unauthorized"});
    }
    if (!priority) {
        return res.status(401).json({message: "Unauthorized"});
    }
    return service.updateTaskPriorityOnBoard({board_tasks_id, priority});
});

todoRoutes.delete("/deleteTakOnBoard", async (req: Request, res) => {
    const board_tasks_id = req.body;
    if (!board_tasks_id) {
        return res.status(401).json({message: "Unauthorized"});
    }
    return service.deleteTakOnBoard({board_tasks_id});

});

export default todoRoutes;