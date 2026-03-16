import { Router } from "express";
import { Request, Response } from "express";
//import { AuthRequest } from "../middleware/auth";
import { ConcreteBoardService } from "./service";
import { AppError } from "../errorHandler/service";

export const todoRoutes = Router();
const service = new ConcreteBoardService();

todoRoutes.get("/GetAllTasksOnBoard", async (req: Request, res: Response) => {
    const result = await service.GetAllTasksOnBoard();
    return res.status(200).json(result);
});

todoRoutes.post("/addTaskToBoard", async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const {task_id} = req.body;
    if(!task_id){
        throw new AppError(401, "Unauthorized");
    }
    const result = await service.addTaskToBoard(userId, {task_id});
    return res.status(200).json(result);
});

todoRoutes.get("/GetTaskOnBoardByTag/:tag", async (req: Request, res) => {
    const userId = req.user!.userId;
    const tag = req.params.tag as string;
    if (!tag) {
        throw new AppError(401, "No tag provided");
    }
    const result = await service.GetTaskOnBoardByTag(userId, { tag });
    return res.status(200).json(result);
});

todoRoutes.get("/GetTaskOnBoardByStatus/:status", async (req: Request, res) => {
    const userId = req.user!.userId;
    const status = req.params.status as string;
    if (!status) {
        throw new AppError(401, "No status provided");
    }
    const result = await service.GetTaskOnBoardByStatus(userId, {status});
    return res.status(200).json(result);
});

todoRoutes.put("/updateTaskTagOnBoard", async (req: Request, res) => {
    const userId = req.user!.userId;
    const {board_tasks_id, tag} = req.body;
    if (!board_tasks_id) {
        throw new AppError(401, "No board_tasks_id provided");
    }
    if (!tag) {
        throw new AppError(401, "No tag provided");
    }
    const result = await service.updateTaskTagOnBoard(userId, {board_tasks_id, tag});
    return res.status(200).json(result);
});

todoRoutes.put("/updateTaskStatusOnBoard", async (req: Request, res) => {
    const userId = req.user!.userId;
    const {board_tasks_id, status} = req.body;
    if (!board_tasks_id) {
        throw new AppError(401, "No board_tasks_id provided");
    }
    if (!status) {
        throw new AppError(401, "No status provided");
    }
    const result = await service.updateTaskStatusOnBoard(userId, {board_tasks_id, status});
    return res.status(200).json(result);
});

todoRoutes.delete("/deleteTakOnBoard", async (req: Request, res) => {
    const userId = req.user!.userId;
    const {board_tasks_id} = req.body;
    if (!board_tasks_id) {
        throw new AppError(401, "No board_tasks_id provided");
    }
    const result = await service.deleteTakOnBoard(userId, {board_tasks_id});
    return res.status(200).json(result);

});

export default todoRoutes;