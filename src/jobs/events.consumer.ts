import { consumeEvents } from "../mq/rabbit";
import { notifyJobEvent } from "../realtime/jobPush";
import { JobsRepository } from "./repository";
import { JobEvent } from "./types";

const repository = new JobsRepository();

function isJobEvent(event: any): event is JobEvent {
    return (
        event &&
        typeof event.jobId === "number" &&
        typeof event.eventType === "string" &&
        (event.eventType === "job.progress" ||
            event.eventType === "job.completed" ||
            event.eventType === "job.failed")
    );
}

export const startJobsEventsConsumer = async () => {
    await consumeEvents(async (event: any) => {
        if(!event || !event.jobId || !event.eventType){
            console.log("bad event", event);
            return;
        }

        const userId = await repository.getUserIdByJobId(event.jobId);
        if(!userId){
            console.log("no job for id", event.jobId);
            return;
        }

        try{
            if (!isJobEvent(event)) {
                console.log("unknown job event", event.eventType);
                return;
            }

            const row = await repository.handleEvent(event, userId);
            if(row) notifyJobEvent(userId, event, row);
        } catch(e){
            console.error(e);
        }
    });
};