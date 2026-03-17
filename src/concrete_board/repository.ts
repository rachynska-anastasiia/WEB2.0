import { pool } from "../db";
import { AppError } from "../errorHandler/service";

export class ConcreteBoardRepository{
    private pool: any;
    constructor(){
        this.pool = pool
    }

    async create(data:any){
        const result = await this.pool.query(
            "INSERT INTO concrete_board (user_id , task_id) VALUES ($1, $2) RETURNING *", 
            [data.userId, data.task_id]);

        if(result.rows[0]) return result.rows[0];
        else throw new AppError(404, "Error");
    }

    async delete(data:any){
        const result = await this.pool.query(
                "DELETE FROM concrete_board WHERE board_tasks_id = $1 and user_id = $2 RETURNING *", 
            [data.board_tasks_id, data.userId]);

        if(result.rows[0]) return result.rows[0];
        else throw new AppError(404, "Task not found");
    }

    async updateTag(data:any){
        const result = await this.pool.query(
            "UPDATE concrete_board SET tag = $1 WHERE board_tasks_id = $2 and user_id = $3 RETURNING *",
            [data.tag, data.board_tasks_id, data.userId]);

        if(result.rows[0]) return result.rows[0];
        else throw new AppError(404, "Error");
    }

    async updateStatus(data:any){
        const result = await this.pool.query(
            "UPDATE concrete_board SET status = $1 WHERE board_tasks_id = $2 and user_id = $3 RETURNING *", 
            [data.status, data.board_tasks_id, data.userId]);

        if(result.rows[0]) return result.rows[0];
        else throw new AppError(404, "Task not found");
    }

    async readStatus(data:any){
        const result = await this.pool.query(
            "SELECT * FROM concrete_board WHERE status = $1 and user_id = $2", 
            [data.status, data.userId]);

        if(result.rows[0]) return result.rows[0];
        else throw new AppError(404, "Task not found");
    }

    async readTag(data:any){
        const result = await this.pool.query(
            "SELECT * FROM concrete_board WHERE tag = $1 and user_id = $2", 
            [data.tag, data.userId]);

        if(result.rows[0]) return result.rows[0];
        else throw new AppError(404, "Task not found");
    }

    async readAll(){
        const result = await this.pool.query(
            "SELECT * FROM concrete_board"
        );

        return result.rows;
    }
}
