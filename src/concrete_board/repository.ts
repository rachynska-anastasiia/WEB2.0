import { pool } from "../db";
import { AppError } from "../errorHandler/service";

export class ConcreteBoardRepository{
    private pool: any;
    constructor(){
        this.pool = pool
    }

    async create(data:any){
        const result = await this.pool.query(
            "INSERT INTO concrete_board (user_id , task_id, tag, priority) VALUES ($1, $2, $3, $4) RETURNING *", 
            [...data]);

        return result[0];
    }

    async delete(data:any){
        const result = await this.pool.query(
            "DELETE FROM concrete_board WHERE board_tasks_id = $1", 
            [...data]);

        return result[0];
    }

    async updateTag(data:any){
        const result = await this.pool.query(
            "UPDATE concrete_board SET tag = $1 WHERE board_tasks_id = $2",
            [...data]);
        return result[0];
    }

    async updateStatus(data:any){
        const result = await this.pool.query(
            "UPDATE concrete_board SET status = $1 WHERE board_tasks_id = $2", 
            [...data]);

        if(result.rows[0]) return result.rows[0];
        else throw new AppError(404, "Error");
    }

    async readStatus(data:any){
        const result = await this.pool.query(
            "SELECT * FROM concrete_board WHERE status = $1", 
            [...data]);

        if(result.rows[0]) return result.rows[0];
        else throw new AppError(404, "Error");
    }

    async readTag(data:any){
        const result = await this.pool.query(
            "SELECT * FROM concrete_board WHERE tag = $1", 
            [...data]);

        return result[0];
    }
    
}
