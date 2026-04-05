//бізнес логіка

//packages

//repositories

//types
import{
    AddTaskDTO,
    DeleteTaskDTO,
    UpdateTaskTitleDTO,
    UpdateTaskDescriptionDTO,
    UpdateTaskDedlineDTO,
    UpdateTaskPriorityDTO,
    GetTaskByTitleDTO,
    GetTaskByPriorityDTO
} from './types';
import { TasksRepository } from "./repository";
import { AppError } from '../errorHandler/service';


export class TasksService{
    private repository: any;
    constructor(){
        this.repository = new TasksRepository();
    }

    async AddTask(userId: number, payload: AddTaskDTO){
        //const userId = req.user?.userId;
        const {title, description} = payload;
        
        try {
            return await this.repository.create({userId, title, description});
        } catch(e){
            if (e instanceof AppError) throw e;
            throw new AppError(500, "Error");
        }
        
    }

    /*async GetAllTasks(){
        try {
            return await this.repository.readAll();
        } catch(e){
            if (e instanceof AppError) throw e;
            throw new AppError(500, "Error");
        }
    }*/

    async GetTaskByTitle(userId: number, payload: GetTaskByTitleDTO){
        const {title} = payload;
        
        try {
            return await this.repository.readTitle({userId, title});
        } catch(e){
            if (e instanceof AppError) throw e;
            throw new AppError(500, "Error");
        }       
    }

    async GetTaskByPriority(userId: number, payload: GetTaskByPriorityDTO){
        const {priority} = payload;
        
        try {
            return await this.repository.readPriority({userId, priority});
        } catch(e){
            if (e instanceof AppError) throw e;
            throw new AppError(500, "Error");
        }
        
    }

    async UpdateTaskTitle(userId: number, payload: UpdateTaskTitleDTO){
        const {task_id, title} = payload;
        
        try {
            return await this.repository.updateTitle({userId, task_id, title});
        } catch(e){
            if (e instanceof AppError) throw e;
            throw new AppError(500, "Error");
        }
        
    }

    async UpdateTaskDescription(userId: number, payload: UpdateTaskDescriptionDTO){
        const {task_id, description} = payload;
        
        try {
            return await this.repository.updateDescription({userId, task_id, description});
        } catch(e){
            if (e instanceof AppError) throw e;
            throw new AppError(500, "Error");
        }
        
    }

    async UpdateTaskDedline(userId: number, payload: UpdateTaskDedlineDTO){
        const {task_id, due_date} = payload;
        
        try {
            return await this.repository.updateDeadline({userId, task_id, due_date});
        } catch(e){
            if (e instanceof AppError) throw e;
            throw new AppError(500, "Error");
        }
        
    }

    async UpdateTaskPriority(userId: number, payload: UpdateTaskPriorityDTO){
        const {task_id, priority} = payload;
        
        try {
            return await this.repository.updatePriority({userId, task_id, priority});
        } catch(e){
            if (e instanceof AppError) throw e;
            throw new AppError(500, "Error");
        }
        
    }

    async deleteTask(userId: number, payload: DeleteTaskDTO){
        const {task_id} = payload;
        
        try {
            return await this.repository.delete({userId, task_id});
        } catch(e){
            if (e instanceof AppError) throw e;
            throw new AppError(500, "Error");
        }
        
    }
}