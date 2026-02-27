//бізнес логіка

//packages

//repositories

//types
import{
    AddTaskToBoardDTO,
    GetTaskOnBoardByTagDTO,
    GetTaskOnBoardByPriorityDTO,
    UpdateTaskTagOnBoardDTO,
    UpdateTaskPriorityOnBoardDTO,
    DeleteTakOnBoardDTO,
} from './types';
import { ConcreteBoardRepository } from "./repository";
import { AppError } from '../errorHandler/service';


export class ConcreteBoardService{
    private repository: any;
    constructor(){
        this.repository = new ConcreteBoardRepository();
    }

    async addTaskToBoard(payload: AddTaskToBoardDTO){
        //const userId = req.user?.userId;
        const {user_id, task_id} = payload;
        
        try {
            return this.repository.create({user_id, task_id});
        } catch(e){
            throw new AppError(500, "Error")
        }
        
    }

    async GetTaskOnBoardByTag(payload: GetTaskOnBoardByTagDTO){
        const {tag} = payload;
        
        try {
            return this.repository.readTag({tag});
        } catch(e){
            throw new AppError(500, "Error")
        }
        
    }

    async GetTaskOnBoardByPriority(payload: GetTaskOnBoardByPriorityDTO){
        const {priority} = payload;
        
        try {
            return this.repository.readPriority({priority});
        } catch(e){
            throw new AppError(500, "Error")
        }
        
    }

    async updateTaskTagOnBoard(payload: UpdateTaskTagOnBoardDTO){
        const {board_tasks_id, tag} = payload;
        
        try {
            return this.repository.updateTag({board_tasks_id, tag});
        } catch(e){
            throw new AppError(500, "Error")
        }
        
    }

    async updateTaskPriorityOnBoard(payload: UpdateTaskPriorityOnBoardDTO){
        const {board_tasks_id, priority} = payload;
        
        try {
            return this.repository.updatePriority({board_tasks_id, priority});
        } catch(e){
            throw new AppError(500, "Error")
        }
        
    }

    async deleteTakOnBoard(payload: DeleteTakOnBoardDTO){
        const {board_tasks_id} = payload;
        
        try {
            return this.repository.delete({board_tasks_id});
        } catch(e){
            throw new AppError(500, "Error")
        }
        
    }
}