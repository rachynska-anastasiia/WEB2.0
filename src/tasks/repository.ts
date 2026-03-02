import { pool } from "../db";
import { AppError } from "../errorHandler/service";

export class TasksRepository{
    private pool: any;
    constructor(){
        this.pool = pool
    }

    async create(data:any){
        const result = await this.pool.query(
            "INSERT INTO tasks (title , description) VALUES ($1, $2) RETURNING *", 
            [data.title, data.description]);

            return result.rows[0];
    }

    async delete(data:any){
        const result = await this.pool.query(
            "DELETE FROM tasks WHERE task_id = $1 RETURNING *",
            [data.task_id]);

        if(result.rows[0]) return result.rows[0];
        else throw new AppError(404, "Task not found");
    }

    async updateTitle(data:any){
        const result = await this.pool.query(
            "UPDATE tasks SET title = $1 WHERE task_id = $2 RETURNING *",
            [data.title, data.task_id]);
        
        if(result.rows[0]) return result.rows[0];
        else throw new AppError(404, "Task not found");
    }

    async updateDescription(data:any){
        const result = await this.pool.query(
            "UPDATE tasks SET description = $1 WHERE task_id = $2 RETURNING *",
            [data.description, data.task_id]);

        if(result.rows[0]) return result.rows[0];
        else throw new AppError(404, "Task not found");
    }

    async updateDeadline(data:any){
        const result = await this.pool.query(
            "UPDATE tasks SET due_date = $1 WHERE task_id = $2 RETURNING *",
            [data.due_date, data.task_id]);

        if(result.rows[0]) return result.rows[0];
        else throw new AppError(404, "Task not found");
    }

    async updatePriority(data:any){
        const result = await this.pool.query(
            "UPDATE tasks SET priority = $1 WHERE task_id = $2 RETURNING *",
            [data.priority, data.task_id]);

        if(result.rows[0]) return result.rows[0];
        else throw new AppError(404, "Task not found");
    }

    async readAll(){
        const result = await this.pool.query(
            "SELECT * FROM tasks"
        );

        return result.rows;
    }

    async readTitle(data:any){
        const result = await this.pool.query(
            "SELECT * FROM tasks WHERE title = $1", 
            [data.title]);

        if(result.rows[0]) return result.rows[0];
        else throw new AppError(404, "Error");
    }

    async readPriority(data:any){
        const result = await this.pool.query(
            "SELECT * FROM tasks WHERE priority = $1", 
            [data.priority]);

        if(result.rows[0]) return result.rows[0];
        else throw new AppError(404, "Error");
    }
}
