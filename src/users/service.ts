import { UsersRepository } from "./repository";
import {
    AddUserDTO,
    DeleteUserDTO,
    UpdateUserNameDTO,
    UpdateUserEmailDTO,
    GetUserByEmailDTO
} from "./types";

import { AppError } from "../errorHandler/service";

export class UsersService{

    private repository:any;

    constructor(){
        this.repository = new UsersRepository();
    }

    async AddUser(payload:AddUserDTO){
        const {name,email} = payload;

        try{
            return await this.repository.create({name,email});
        }catch(e){
            if(e instanceof AppError) throw e;
            throw new AppError(500,"Error");
        }
    }

    async GetAllUsers(){
        return await this.repository.readAll();
    }

    async GetUserByEmail(payload:GetUserByEmailDTO){
        const {email} = payload;

        return await this.repository.readEmail({email});
    }

    async UpdateUserName(payload:UpdateUserNameDTO){
        const {id,name} = payload;

        return await this.repository.updateName({id,name});
    }

    async UpdateUserEmail(payload:UpdateUserEmailDTO){
        const {id,email} = payload;

        return await this.repository.updateEmail({id,email});
    }

    async DeleteUser(payload:DeleteUserDTO){
        const {id} = payload;

        return await this.repository.delete({id});
    }
}