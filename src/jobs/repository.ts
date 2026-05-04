import { pool } from "../db";
import { AppError } from "../errorHandler/service";
import { JobEvent } from "./types";

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
        if(result.rows[0]) return result.rows[0];
        return null;
    }

    async updateJobStatus(id:number, data:Partial<{status: string, error: string, s3_key: string}>, userId: number){
        const result = await this.pool.query(
            `UPDATE jobs SET status = COALESCE($1, status),
            error = COALESCE($2, error),
            updated_at = CURRENT_TIMESTAMP,
            s3_key = COALESCE($3, s3_key)   
            WHERE id = $4 AND user_id = $5 RETURNING *
            `,[data.status, data.error, data.s3_key, id, userId]
        );
        if(result.rows[0]) return result.rows[0];
        else throw new AppError(404, "Job not found");
    }

    async handleEvent(event: JobEvent, userId:number){
        if(event.eventType == "job.progress")
            return this.updateJobStatus(event.jobId, {status: 'PROCESSING'}, userId);
        
        if(event.eventType == "job.completed")
            return this.updateJobStatus(event.jobId, {status: 'DONE', s3_key: event.resultLink.key}, userId);
        
        if(event.eventType == "job.failed")
            return this.updateJobStatus(event.jobId, {status: 'ERROR', error: event.error.message}, userId);
    }

    async getUserIdByJobId(jobId: any){
        const result = await this.pool.query(
            "SELECT user_id FROM jobs WHERE id = $1",
            [jobId]
        );
        if(!result.rows[0]) return null;
        return result.rows[0].user_id;
    }

    async listJobsByUserId(userId: number) {
        const result = await this.pool.query(
            `SELECT id, user_id, title, status, idempotency_key, error, created_at, updated_at, s3_key
             FROM jobs WHERE user_id = $1 ORDER BY created_at DESC`,
            [userId]
        );
        return result.rows;
    }
}


/* async getUserIdByJobId(jobId: any){
        const result = await this.pool.query(
            "SELECT user_id FROM jobs WHERE id = $1",
            [jobId]
        );
        if(!result.rows[0]) return null;
        return result.rows[0].user_id;
    } */