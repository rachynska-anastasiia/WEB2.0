import {
    CreateJobDTO,
    JobRequestedEventDTO
} from './types';
import { JobsRepository } from "./repository";
import { AppError } from '../errorHandler/service';
import { publishRequest } from '../mq/rabbit';
import { getJsonFile } from "../storage/s3";

export class JobsService {
    private repository: JobsRepository;

    constructor() {
        this.repository = new JobsRepository();
    }

    async listJobs(userId: number) {
        return await this.repository.listJobsByUserId(userId);
    }

    async createJob(userId: number, data: CreateJobDTO) {
        const { idempotency_key, title } = data;

        const job = await this.repository.findJobByUserIdAndIdempotencyKey({
            userId,
            idempotency_key
        });

        if (job) return job;

        const newJob = await this.repository.createJob({
            userId,
            idempotency_key,
            title
        });

        const event: JobRequestedEventDTO = {
            eventType: "job.requested",
            timestamp: new Date().toISOString(),
            jobId: newJob.id,
            jobType: "task_stats",
            payload: { title: newJob.title }
        };

        await publishRequest(event);

        return newJob;
    }

    async getJobStatus(userId: number, id: number) {
        try {
            return await this.repository.getJobById({ userId, id });
        } catch (e) {
            if (e instanceof AppError) throw e;
            throw new AppError(500, "Error");
        }
    }

    async getJobResult(userId: number, id: number) {
        try {
            const job = await this.repository.getJobById({ userId, id });

            if (!job) {
                throw new AppError(404, "Job not found");
            }

            if (job.status !== "DONE") {
                throw new AppError(400, "Job is not finished");
            }

            if (!job.s3_key) {
                throw new AppError(500, "Missing s3_key");
            }

            try {
                const data = await getJsonFile(job.s3_key);
                return data;
            } catch (err: any) {
                if (err.name === "NoSuchKey") {
                    throw new AppError(404, "Result not found in storage");
                }

                throw new AppError(503, "Storage unavailable");
            }

        } catch (e) {
            if (e instanceof AppError) throw e;
            throw new AppError(500, "Error");
        }
    }
}