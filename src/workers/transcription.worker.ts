import amqp from "amqplib";
import { pool } from "../db";

const QUEUE = "transcription.request";

const startWorker = async () => {

    const connection = await amqp.connect(process.env.RABBITMQ_URL as string);
    const channel = await connection.createChannel();

    await channel.assertQueue(QUEUE, { durable: true });

    channel.consume(
        QUEUE,
        async (msg) => {
            if (!msg) return;

            const { jobId } = JSON.parse(msg.content.toString());

            try {
                const result = await pool.query(
                    `
                    UPDATE jobs
                    SET status = 'PROCESSING'
                    WHERE id = $1 AND status = 'QUEUED'
                    RETURNING *
                    `,
                    [jobId]
                );

                if (result.rowCount === 0) {
                    channel.ack(msg);
                    return;
                }

                console.log(`Processing job ${jobId}`);

                await new Promise((res) => setTimeout(res, 3000));

                await pool.query(
                    `
                    UPDATE jobs
                    SET status = 'DONE', result = $1
                    WHERE id = $2
                    `,
                    ["Fake transcription result", jobId]
                );

                console.log(`Finished job ${jobId}`);
            } catch (error) {
                console.error(error);

                await pool.query(
                    `
                    UPDATE jobs
                    SET status = 'FAILED', error = $1
                    WHERE id = $2
                    `,
                    [String(error), jobId]
                );
            }

            channel.ack(msg);
        },
        { noAck: false }
    );
};

startWorker();