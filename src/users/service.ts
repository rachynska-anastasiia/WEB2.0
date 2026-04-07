import { UsersRepository } from "./repository";
import {
    AddUserDTO,
    DeleteUserDTO,
    UpdateUserNameDTO,
    UpdateUserEmailDTO,
    GetUserByEmailDTO
} from "./types";

import { AppError } from "../errorHandler/service";
import jwt from "jsonwebtoken";

const SECRET = "supersecret";

export class UsersService {

    private repository: UsersRepository;

    constructor() {
        this.repository = new UsersRepository();
    }

    async AddUser(payload: AddUserDTO) {
        const { name, email } = payload;
        if(!name) throw new AppError(400,"Name required");
        if(!email) throw new AppError(400,"Email required");
        try {
            return await this.repository.create({ name, email });
        } catch (e:any) {
            if (e.code === '23505' || e.message.includes('unique constraint')) {
                throw new AppError(400, "User with this email already exists");
            }
            if (e instanceof AppError) throw e;
            throw new AppError(500, "Error");
        }
    }
/*
    async GetUserByEmail(payload: GetUserByEmailDTO) {
        const { email } = payload;
        return await this.repository.readEmail({ email });
    }*/

    async GetUserByEmail(payload: GetUserByEmailDTO) {
        const { email } = payload;
        if (!email) throw new AppError(400,"email required");
        try{
            const user = await this.repository.readEmail({ email });
            if (!user) throw new AppError(404, "User not found");

            const token = jwt.sign(
                { userId: user.id },
                SECRET,
                { expiresIn: "1h" }
            );

            return { token };
        }catch(e){
            if(e instanceof AppError) throw e;
            throw new AppError(500,"Error");
        }
        
    }

    async UpdateUserName(userId: number, payload: UpdateUserNameDTO) {
        const { name } = payload;
        if (!name) throw new AppError(400,"Name required");
        try{
            return await this.repository.updateName({ userId, name });
        }catch(e){
            if(e instanceof AppError) throw e;
            throw new AppError(500,"Error");
        } 
    }

    async UpdateUserEmail(userId: number, payload: UpdateUserEmailDTO) {
        const { email } = payload;
        if (!email) throw new AppError(400,"email required");
        try{
            return await this.repository.updateEmail({ userId, email });
        }catch(e){
            if(e instanceof AppError) throw e;
            throw new AppError(500,"Error");
        } 
    }

    async DeleteUser(payload: DeleteUserDTO) {
        const { userId } = payload;
        try{
            return await this.repository.delete({ userId });
        }catch(e){
            if(e instanceof AppError) throw e;
            throw new AppError(500,"Error");
        } 
        
    }

    
/*
    async Login({ id }: { id: number }) {

        const user = await this.repository.getById({ id });

        if (!user) {
            throw new AppError(404, "User not found");
        }

        const token = jwt.sign(
            { userId: user.id },
            SECRET,
            { expiresIn: "1h" }
        );

        return { token };
    }*/
/*
    async GetAllUsers() {
        return await this.repository.readAll();
    }*/
}