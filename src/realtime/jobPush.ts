import { JobEvent } from "../jobs/types";
import { pushJsonToUser } from "./pushHub";

type JobRow = {
    id?: number;
    status?: string;
    s3_key?: string | null;
    error?: string | null;
};

function getMessageTime(event: JobEvent): string {
    return event.timestamp || new Date().toISOString();
}

export function notifyJobEvent(userId: number, event: JobEvent, jobRow: JobRow): void {
    const basePayload = {
        channel: "jobs",
        jobId: event.jobId,
        at: getMessageTime(event),
    };

    if (event.eventType === "job.progress") {
        pushJsonToUser(userId, {
            ...basePayload,
            type: "progress",
        });

        pushJsonToUser(userId, {
            ...basePayload,
            type: "status_update",
            status: jobRow.status || "PROCESSING",
        });

        return;
    }

    if (event.eventType === "job.completed") {
        pushJsonToUser(userId, {
            ...basePayload,
            type: "status_update",
            status: jobRow.status || "DONE",
        });

        pushJsonToUser(userId, {
            ...basePayload,
            type: "completion",
            success: true,
            s3_key: jobRow.s3_key || event.resultLink.key,
        });

        return;
    }

    if (event.eventType === "job.failed") {
        const error = jobRow.error || event.error.message;

        pushJsonToUser(userId, {
            ...basePayload,
            type: "status_update",
            status: jobRow.status || "ERROR",
            error,
        });

        pushJsonToUser(userId, {
            ...basePayload,
            type: "completion",
            success: false,
            error,
        });
    }
}