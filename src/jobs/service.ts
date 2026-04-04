import{
    CreateJobDTO,
    JobRequestedEventDTO
} from './types';
import { JobsRepository } from "./repository";
import { AppError } from '../errorHandler/service';
import { publishRequest } from '../mq/rabbit';


export class JobsService{
    private repository: JobsRepository;
    constructor(){
        this.repository = new JobsRepository();
    }

    async createJob(userId: number, data: CreateJobDTO){
        const {idempotency_key, title} = data;
        const job = await this.repository.findJobByUserIdAndIdempotencyKey({userId, idempotency_key});
        if(job) return job;
        const newJob = await this.repository.createJob({userId, idempotency_key, title});
        const event: JobRequestedEventDTO = {
            eventType: "job.requested", timestamp: new Date().toISOString(),
            jobId: newJob.id, jobType: "task_stats",
            payload: { title: newJob.title }
        };
        await publishRequest(event);
        return newJob;
    }

    async getJobStatus(userId: number, id: number){
        try {
            return await this.repository.getJobById({userId, id});
        } catch(e){
            if (e instanceof AppError) throw e;
            throw new AppError(500, "Error");
        }
    }

}