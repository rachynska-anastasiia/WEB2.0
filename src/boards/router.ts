import { Router } from "express";
import { BoardsService } from "./service";
import { AppError } from "../errorHandler/service";

export const boardRoutes = Router();
const service = new BoardsService();

boardRoutes.get("/GetAllBoards", async(req,res)=>{
    const result = await service.GetAllBoards();
    return res.status(200).json(result);
});

boardRoutes.post("/AddBoard", async(req,res)=>{
    const {name,user_id} = req.body;

    if(!name) throw new AppError(401,"Name required");
    if(!user_id) throw new AppError(401,"user_id required");

    const result = await service.AddBoard({name,user_id});
    return res.status(200).json(result);
});

boardRoutes.delete("/DeleteBoard", async(req,res)=>{
    const {id} = req.body;

    const result = await service.DeleteBoard({id});
    return res.status(200).json(result);
});

export default boardRoutes