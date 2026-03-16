import { pool } from "../db";
import { AppError } from "../errorHandler/service";

export class BoardsRepository{

    private pool:any;

    constructor(){
        this.pool = pool;
    }

    async create(data:any){
        const result = await this.pool.query(
            "INSERT INTO boards (name,user_id) VALUES ($1,$2) RETURNING *",
            [data.name,data.user_id]
        );

        return result.rows[0];
    }

    async delete(data:any){
        const result = await this.pool.query(
            "DELETE FROM boards WHERE id = $1 RETURNING *",
            [data.id]
        );

        if(result.rows[0]) return result.rows[0];
        else throw new AppError(404,"Board not found");
    }

    async updateName(data:any){
        const result = await this.pool.query(
            "UPDATE boards SET name = $1 WHERE id = $2 RETURNING *",
            [data.name,data.id]
        );

        if(result.rows[0]) return result.rows[0];
        else throw new AppError(404,"Board not found");
    }

    async readAll(){
        const result = await this.pool.query(
            "SELECT * FROM boards"
        );

        return result.rows;
    }

    async readByUser(data:any){
        const result = await this.pool.query(
            "SELECT * FROM boards WHERE user_id = $1",
            [data.user_id]
        );

        return result.rows;
    }
}