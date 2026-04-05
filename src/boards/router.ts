import { Router } from "express";
import { BoardsService } from "./service";
import { AppError } from "../errorHandler/service";

export const boardRoutes = Router();
const service = new BoardsService();



boardRoutes.post("/AddBoard", async(req,res)=>{
    const userId = req.user!.userId;
    const {name} = req.body;

    if(!name) throw new AppError(401,"Name required");

    const result = await service.AddBoard(userId, {name});
    return res.status(200).json(result);
});

boardRoutes.delete("/DeleteBoard", async(req,res)=>{
    const userId = req.user!.userId;
    const {id} = req.body;

    const result = await service.DeleteBoard(userId, {id});
    return res.status(200).json(result);
});

boardRoutes.get("/GetBoardsByUser", async(req,res)=>{
    const userId = req.user!.userId;

    const result = await service.GetBoardsByUser(userId);
    return res.status(200).json(result);
});

boardRoutes.put("/UpdateBoardName", async(req,res)=>{
    const userId = req.user!.userId;
    const {id, name} = req.body;

    const result = await service.UpdateBoardName(userId, {id, name});
    return res.status(200).json(result);
});

/*
boardRoutes.get("/GetAllBoards", async(req,res)=>{
    const result = await service.GetAllBoards();
    return res.status(200).json(result);
});*/

export default boardRoutes