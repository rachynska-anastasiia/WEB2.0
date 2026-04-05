export type CreateJobDTO = {
    idempotency_key: string;
    title: string;
};

export type JobRequestedEventDTO = {
    eventType: "job.requested";
    timestamp: string;
    jobId:number;
    jobType: "task_stats";
    payload: unknown;
}

export type JobProgressEventDTO = {
    eventType: "job.progress";
    timestamp: string;
    jobId:number;
}

export type JobCompletedEventDTO = {
    eventType: "job.completed";
    timestamp: string;
    jobId:number;
    result: unknown;
}

export type JobFailedEventDTO = {
    eventType: "job.failed";
    timestamp: string;
    jobId:number;
    error: { code?: string; message: string };
}

export type JobEvent = JobProgressEventDTO | JobCompletedEventDTO | JobFailedEventDTO;