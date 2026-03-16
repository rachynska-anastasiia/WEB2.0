import { BoardsRepository } from "./repository";
import {
    AddBoardDTO,
    DeleteBoardDTO,
    UpdateBoardNameDTO,
    GetBoardByUserDTO
} from "./types";

import { AppError } from "../errorHandler/service";

export class BoardsService{

    private repository:any;

    constructor(){
        this.repository = new BoardsRepository();
    }

    async AddBoard(payload:AddBoardDTO){
        const {name,user_id} = payload;

        try{
            return await this.repository.create({name,user_id});
        }catch(e){
            if(e instanceof AppError) throw e;
            throw new AppError(500,"Error");
        }
    }

    async GetAllBoards(){
        return await this.repository.readAll();
    }

    async GetBoardsByUser(payload:GetBoardByUserDTO){
        const {user_id} = payload;

        return await this.repository.readByUser({user_id});
    }

    async UpdateBoardName(payload:UpdateBoardNameDTO){
        const {id,name} = payload;

        return await this.repository.updateName({id,name});
    }

    async DeleteBoard(payload:DeleteBoardDTO){
        const {id} = payload;

        return await this.repository.delete({id});
    }
}