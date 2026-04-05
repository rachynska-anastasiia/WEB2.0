import { pool } from "../db";
import { AppError } from "../errorHandler/service";

export class TasksRepository{
    private pool: any;
    constructor(){
        this.pool = pool
    }

    async create(data:any){
        const result = await this.pool.query(
            "INSERT INTO tasks (title , description, user_id) VALUES ($1, $2, $3) RETURNING *", 
            [data.title, data.description, data.userId]);

            return result.rows[0];
    }

    async delete(data:any){
        const result = await this.pool.query(
            "DELETE FROM tasks WHERE task_id = $1 AND user_id = $2 RETURNING *",
            [data.task_id, data.userId]);

        if(result.rows[0]) return result.rows[0];
        else throw new AppError(404, "Task not found");
    }

    async updateTitle(data:any){
        const result = await this.pool.query(
            "UPDATE tasks SET title = $1 WHERE task_id = $2 AND user_id = $3 RETURNING *",
            [data.title, data.task_id, data.userId]);
        
        if(result.rows[0]) return result.rows[0];
        else throw new AppError(404, "Task not found");
    }

    async updateDescription(data:any){
        const result = await this.pool.query(
            "UPDATE tasks SET description = $1 WHERE task_id = $2 AND user_id = $3 RETURNING *",
            [data.description, data.task_id, data.userId]);

        if(result.rows[0]) return result.rows[0];
        else throw new AppError(404, "Task not found");
    }

    async updateDeadline(data:any){
        const result = await this.pool.query(
            "UPDATE tasks SET due_date = $1 WHERE task_id = $2 AND user_id = $3 RETURNING *",
            [data.due_date, data.task_id, data.userId]);

        if(result.rows[0]) return result.rows[0];
        else throw new AppError(404, "Task not found");
    }

    async updatePriority(data:any){
        const result = await this.pool.query(
            "UPDATE tasks SET priority = $1 WHERE task_id = $2 AND user_id = $3 RETURNING *",
            [data.priority, data.task_id, data.userId]);

        if(result.rows[0]) return result.rows[0];
        else throw new AppError(404, "Task not found");
    }

    /*async readAll(){
        const result = await this.pool.query(
            "SELECT * FROM tasks"
        );

        return result.rows;
    }*/

    async readTitle(data:any){
        const result = await this.pool.query(
            "SELECT * FROM tasks WHERE title = $1 AND user_id = $2", 
            [data.title, data.userId]);

        if(result.rows[0]) return result.rows[0];
        else throw new AppError(404, "Error");
    }

    async readPriority(data:any){
        const result = await this.pool.query(
            "SELECT * FROM tasks WHERE priority = $1 AND user_id = $2", 
            [data.priority, data.userId]);

        if(result.lenght > 0) return result;
        else throw new AppError(404, "Error");
    }
}
