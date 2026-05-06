import { apiGet, apiPost } from "./client";

export type JobStatus = "CREATED" | "PROCESSING" | "DONE" | "ERROR";

export type JobRow = {
  id: number;
  user_id: number;
  title: string;
  status: JobStatus;
  idempotency_key: string;
  error: string | null;
  created_at: string;
  updated_at: string;
  s3_key: string | null;
};

export type JobSocketMessage = {
  channel: "jobs";
  type: "connected" | "progress" | "status_update" | "completion";
  jobId?: number;
  status?: JobStatus;
  success?: boolean;
  error?: string;
  s3_key?: string;
  at: string;
};

export async function getJobs(): Promise<JobRow[]> {
  return apiGet<JobRow[]>("/jobs");
}

export async function createJob(title: string): Promise<JobRow> {
  return apiPost<JobRow>("/jobs/createJob", {
    title,
    idempotency_key: `${Date.now()}-${crypto.randomUUID()}`,
  });
}

export async function getJob(id: number): Promise<JobRow> {
  return apiGet<JobRow>(`/jobs/${id}`);
}

export async function getJobResult(id: number): Promise<unknown> {
  return apiGet<unknown>(`/jobs/${id}/result`);
}