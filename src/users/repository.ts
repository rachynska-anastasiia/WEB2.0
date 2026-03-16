import { pool } from "../db";
import { AppError } from "../errorHandler/service";

export class UsersRepository {

    private pool: any;

    constructor(){
        this.pool = pool;
    }

    async create(data:any){
        const result = await this.pool.query(
            "INSERT INTO users (name,email) VALUES ($1,$2) RETURNING *",
            [data.name, data.email]
        );

        return result.rows[0];
    }

    async delete(data:any){
        const result = await this.pool.query(
            "DELETE FROM users WHERE id = $1 RETURNING *",
            [data.id]
        );

        if(result.rows[0]) return result.rows[0];
        else throw new AppError(404,"User not found");
    }

    async updateName(data:any){
        const result = await this.pool.query(
            "UPDATE users SET name = $1 WHERE id = $2 RETURNING *",
            [data.name, data.id]
        );

        if(result.rows[0]) return result.rows[0];
        else throw new AppError(404,"User not found");
    }

    async updateEmail(data:any){
        const result = await this.pool.query(
            "UPDATE users SET email = $1 WHERE id = $2 RETURNING *",
            [data.email, data.id]
        );

        if(result.rows[0]) return result.rows[0];
        else throw new AppError(404,"User not found");
    }

    async readAll(){
        const result = await this.pool.query(
            "SELECT * FROM users"
        );

        return result.rows;
    }

    async readEmail(data:any){
        const result = await this.pool.query(
            "SELECT * FROM users WHERE email = $1",
            [data.email]
        );

        if(result.rows[0]) return result.rows[0];
        else throw new AppError(404,"User not found");
    }
}