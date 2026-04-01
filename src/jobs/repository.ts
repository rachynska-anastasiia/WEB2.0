import { pool } from "../db";
import { AppError } from "../errorHandler/service";

export class JobsRepository{
    private pool: typeof pool;

    constructor(){
        this.pool = pool
    }

    async createJob(data: any){
        const result = await this.pool.query(
            "INSERT INTO jobs (user_id, idempotency_key, title) VALUES ($1, $2, $3) RETURNING *",
            [data.userId, data.idempotency_key, data.title]
        );
        if(result.rows[0]) return result.rows[0];
        throw new AppError(500, "Failed to create job");
    }

    async getJobById(data: any){
        const result = await this.pool.query(
            "SELECT * FROM jobs WHERE id = $1 AND user_id = $2",
            [data.id, data.userId]
        );
        if(result.rows[0]) return result.rows[0];
        else throw new AppError(404, "Job not found");
    }

    async findJobByUserIdAndIdempotencyKey(data: any){
        const result = await this.pool.query(
            "SELECT * FROM jobs WHERE user_id = $1 AND idempotency_key = $2",
            [data.userId, data.idempotency_key]
        );
        return result.rows[0] ?? null;
    }
}
