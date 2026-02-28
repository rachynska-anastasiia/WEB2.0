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

    async GetTaskOnBoardByStatus(payload: GetTaskOnBoardByStatusDTO){
        const {status} = payload;
        
        try {
            return this.repository.readStatus({status});
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

    async updateTaskStatusOnBoard(payload: UpdateTaskStatusOnBoardDTO){
        const {board_tasks_id, status} = payload;
        
        try {
            return this.repository.updateStatus({board_tasks_id, status});
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