import { BoardsRepository } from "./repository";
import {
    AddBoardDTO,
    DeleteBoardDTO,
    UpdateBoardNameDTO,
    //GetBoardByUserDTO
} from "./types";

import { AppError } from "../errorHandler/service";

export class BoardsService{

    private repository:any;

    constructor(){
        this.repository = new BoardsRepository();
    }

    async AddBoard(userId: number, payload:AddBoardDTO){
        const {name} = payload;

        try{
            return await this.repository.create({userId, name});
        }catch(e){
            if(e instanceof AppError) throw e;
            throw new AppError(500,"Error");
        }
    }

    async DeleteBoard(userId: number, payload:DeleteBoardDTO){
        const {id} = payload;

        return await this.repository.delete({userId, id});
    }

    /*async GetAllBoards(){
        return await this.repository.readAll();
    }*/

    async GetBoardsByUser(userId: number){
        //const {user_id} = payload;

        return await this.repository.readByUser({userId});
    }

    async UpdateBoardName(userId: number, payload:UpdateBoardNameDTO){
        const {id, name} = payload;

        return await this.repository.updateName({userId, id, name});
    }
}