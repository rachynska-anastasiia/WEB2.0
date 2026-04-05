import amqp, {Channel} from 'amqplib';
import  { JobRequestedEventDTO } from '../jobs/types';

let channel: Channel | undefined;

const REQUEST_QUEUE = 'job.request';
const EVENTS_QUEUE = 'job.events';

export const connect = async () => {
    try{
        const amqpUrl = process.env.RABBITMQ_URL as string;
        const connection = await amqp.connect(amqpUrl);

        channel = await connection.createChannel();
        await channel.assertQueue(REQUEST_QUEUE, {durable: true});
        await channel.assertQueue(EVENTS_QUEUE, {durable: true});
    } catch (error) {
        console.error('Failed to connect to RabbitMQ:', error);
    }
};

export const publishRequest = async (event: JobRequestedEventDTO) => {
    if (!channel) throw new Error("RabbitMQ is not connected");

    const message = JSON.stringify(event);
    channel.sendToQueue(REQUEST_QUEUE, Buffer.from(message), {persistent: true});
    console.log(`Request published for job ${event.jobId}`);
};

export const consumeEvents = async (
    handler: (event: any) => Promise<void> | void
) => {
    if (!channel) throw new Error("RabbitMQ is not connected");
    await channel.consume(EVENTS_QUEUE, async(message) => {
        if(!message) return;
        try{
            const event = JSON.parse(message.content.toString());
            await handler(event);
        } catch(error){
            console.error(error);
        } finally{
            channel!.ack(message);
        }
    });
};