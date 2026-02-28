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
            [...data]);

        return result[0];
    }

    async delete(data:any){
        const result = await this.pool.query(
            "DELETE FROM tasks WHERE task_id = $1", 
            [...data]);

        return result[0];
    }

    async updateTitle(data:any){
        const result = await this.pool.query(
            "UPDATE tasks SET title = $1 WHERE task_id = $2",
            [...data]);
        return result[0];
    }

    async updateDescription(data:any){
        const result = await this.pool.query(
            "UPDATE tasks SET description = $1 WHERE task_id = $2", 
            [...data]);

        if(result.rows[0]) return result.rows[0];
        else throw new AppError(404, "Error");
    }

    async updateDeadline(data:any){
        const result = await this.pool.query(
            "UPDATE tasks SET due_date = $1 WHERE task_id = $2", 
            [...data]);

        if(result.rows[0]) return result.rows[0];
        else throw new AppError(404, "Error");
    }

    async updatePriority(data:any){
        const result = await this.pool.query(
            "UPDATE tasks SET priority = $1 WHERE task_id = $2", 
            [...data]);

        if(result.rows[0]) return result.rows[0];
        else throw new AppError(404, "Error");
    }

    async readTitle(data:any){
        const result = await this.pool.query(
            "SELECT * FROM tasks WHERE title = $1", 
            [...data]);

        if(result.rows[0]) return result.rows[0];
        else throw new AppError(404, "Error");
    }

    async readPriority(data:any){
        const result = await this.pool.query(
            "SELECT * FROM tasks WHERE priority = $1", 
            [...data]);

        if(result.rows[0]) return result.rows[0];
        else throw new AppError(404, "Error");
    }
}
