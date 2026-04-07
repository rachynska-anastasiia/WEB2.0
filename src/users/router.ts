import { Router } from "express";
import { UsersService } from "./service";
import { AppError } from "../errorHandler/service";
import { authMiddleware } from "../middleware/auth";

export const userRoutes = Router();
const service = new UsersService();

userRoutes.post("/AddUser", async(req,res)=>{
    const {name,email} = req.body;
    const result = await service.AddUser({name,email});
    return res.status(200).json(result);
});

userRoutes.put("/UpdateUserName", authMiddleware, async(req,res)=>{
    const userId = req.user!.userId;
    const {name} = req.body;
    const result = await service.UpdateUserName(userId, {name});
    return res.status(200).json(result);
});

userRoutes.put("/UpdateUserEmail", authMiddleware, async(req,res)=>{
    const userId = req.user!.userId;
    const {email} = req.body;
    const result = await service.UpdateUserEmail(userId, {email});
    return res.status(200).json(result);
});

userRoutes.get("/Login/:email", async(req,res)=>{
    const email = req.params.email;
    const result = await service.GetUserByEmail({email});
    return res.status(200).json(result);
});

userRoutes.delete("/DeleteUser", authMiddleware, async(req,res)=>{
    const userId = req.user!.userId;
    //const {id} = req.body;

    const result = await service.DeleteUser({userId});
    return res.status(200).json(result);
});

/*
userRoutes.get("/GetAllUsers", async(req,res)=>{
    const result = await service.GetAllUsers();
    return res.status(200).json(result);
});*/

export default userRoutes