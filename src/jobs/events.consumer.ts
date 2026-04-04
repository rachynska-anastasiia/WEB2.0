import { consumeEvents } from "../mq/rabbit";
import { JobsRepository } from "./repository";

const repository = new JobsRepository();

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
            await repository.handleEvent(event, userId);
        } catch(e){
            console.error(e);
        }
    });
};
