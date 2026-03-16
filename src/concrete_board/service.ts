//бізнес логіка

//packages

//repositories

//types
import{
    AddTaskToBoardDTO,
    GetTaskOnBoardByTagDTO,
    GetTaskOnBoardByStatusDTO,
    UpdateTaskTagOnBoardDTO,
    UpdateTaskStatusOnBoardDTO,
    DeleteTakOnBoardDTO,
} from './types';
import { ConcreteBoardRepository } from "./repository";
import { AppError } from '../errorHandler/service';


export class ConcreteBoardService{
    private repository: any;
    constructor(){
        this.repository = new ConcreteBoardRepository();
    }

    async addTaskToBoard(userId: number, payload: AddTaskToBoardDTO){
        //const userId = req.user?.userId;
        const {task_id} = payload;
        
        try {
            return this.repository.create({userId, task_id});
        } catch(e){
            throw new AppError(500, "Error")
        }
        
    }

    async GetAllTasksOnBoard(){
        try {
            return this.repository.readAll();
        } catch(e){
            throw new AppError(500, "Error")
        }
    }

    async GetTaskOnBoardByTag(userId: number, payload: GetTaskOnBoardByTagDTO){
        const {tag} = payload;
        
        try {
            return this.repository.readTag({userId, tag});
        } catch(e){
            throw new AppError(500, "Error")
        }
        
    }

    async GetTaskOnBoardByStatus(userId: number, payload: GetTaskOnBoardByStatusDTO){
        const {status} = payload;
        
        try {
            return this.repository.readStatus({userId, status});
        } catch(e){
            throw new AppError(500, "Error")
        }
        
    }

    async updateTaskTagOnBoard(userId: number, payload: UpdateTaskTagOnBoardDTO){
        const {board_tasks_id, tag} = payload;
        
        try {
            return this.repository.updateTag({userId, board_tasks_id, tag});
        } catch(e){
            throw new AppError(500, "Error")
        }
        
    }

    async updateTaskStatusOnBoard(userId: number, payload: UpdateTaskStatusOnBoardDTO){
        const {board_tasks_id, status} = payload;
        
        try {
            return this.repository.updateStatus({userId, board_tasks_id, status});
        } catch(e){
            throw new AppError(500, "Error")
        }
        
    }

    async deleteTakOnBoard(userId: number, payload: DeleteTakOnBoardDTO){
        const {board_tasks_id} = payload;
        
        try {
            return this.repository.delete({userId, board_tasks_id});
        } catch(e){
            throw new AppError(500, "Error")
        }
        
    }
}