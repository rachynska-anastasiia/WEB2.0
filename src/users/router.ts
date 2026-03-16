import { Router } from "express";
import { UsersService } from "./service";
import { AppError } from "../errorHandler/service";

export const userRoutes = Router();
const service = new UsersService();

userRoutes.get("/GetAllUsers", async(req,res)=>{
    const result = await service.GetAllUsers();
    return res.status(200).json(result);
});

userRoutes.post("/AddUser", async(req,res)=>{
    const {name,email} = req.body;

    if(!name) throw new AppError(401,"Name required");
    if(!email) throw new AppError(401,"Email required");

    const result = await service.AddUser({name,email});
    return res.status(200).json(result);
});

userRoutes.get("/GetUserByEmail/:email", async(req,res)=>{
    const email = req.params.email;

    const result = await service.GetUserByEmail({email});
    return res.status(200).json(result);
});

userRoutes.delete("/DeleteUser", async(req,res)=>{
    const {id} = req.body;

    const result = await service.DeleteUser({id});
    return res.status(200).json(result);
});

export default userRoutes