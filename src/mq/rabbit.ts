import amqp, {Channel} from 'amqplib';

let channel: Channel | undefined;

export const connect = async () => {
    try{
        const amqpUrl = process.env.RABBITMQ_URL as string;
        const connection = await amqp.connect(amqpUrl);
        channel = await connection.createChannel();
        await channel.assertQueue('transcription.request', {durable: true});
    } catch (error) {
        console.error('Failed to connect to RabbitMQ:', error);
    }
};

export const publishRequest = async (jobId: number, payload: unknown) => {
    if (!channel) {
        throw new Error("RabbitMQ is not connected. Call connect() first.");
    }
    const message = JSON.stringify({ jobId, payload });
    channel.sendToQueue("transcription.request", Buffer.from(message), {persistent: true});
    console.log(`Request published for job ${jobId}`);
};