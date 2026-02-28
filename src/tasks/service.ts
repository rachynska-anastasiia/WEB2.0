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

    async AddTask(payload: AddTaskDTO){
        //const userId = req.user?.userId;
        const {title, description} = payload;
        
        try {
            return this.repository.create({title, description});
        } catch(e){
            throw new AppError(500, "Error")
        }
        
    }

    async GetTaskByTitle(payload: GetTaskByTitleDTO){
        const {title} = payload;
        
        try {
            return this.repository.readTitle({title});
        } catch(e){
            throw new AppError(500, "Error")
        }
        
    }

    async GetTaskByPriority(payload: GetTaskByPriorityDTO){
        const {priority} = payload;
        
        try {
            return this.repository.readPriority({priority});
        } catch(e){
            throw new AppError(500, "Error")
        }
        
    }

    async UpdateTaskTitle(payload: UpdateTaskTitleDTO){
        const {task_id, title} = payload;
        
        try {
            return this.repository.updateTitle({task_id, title});
        } catch(e){
            throw new AppError(500, "Error")
        }
        
    }

    async UpdateTaskDescription(payload: UpdateTaskDescriptionDTO){
        const {task_id, description} = payload;
        
        try {
            return this.repository.updateDescription({task_id, description});
        } catch(e){
            throw new AppError(500, "Error")
        }
        
    }

    async UpdateTaskDedline(payload: UpdateTaskDedlineDTO){
        const {task_id, due_date} = payload;
        
        try {
            return this.repository.updateDeadline({task_id, due_date});
        } catch(e){
            throw new AppError(500, "Error")
        }
        
    }

    async UpdateTaskPriority(payload: UpdateTaskPriorityDTO){
        const {task_id, priority} = payload;
        
        try {
            return this.repository.updatePriority({task_id, priority});
        } catch(e){
            throw new AppError(500, "Error")
        }
        
    }

    async deleteTask(payload: DeleteTaskDTO){
        const {task_id} = payload;
        
        try {
            return this.repository.delete({task_id});
        } catch(e){
            throw new AppError(500, "Error")
        }
        
    }
}