import amqp from "amqplib";
import { pool } from "../db";

const QUEUE = "transcription.events";

export const startEventsConsumer = async () => {
    const connection = await amqp.connect(process.env.RABBITMQ_URL as string);
    const channel = await connection.createChannel();

    await channel.assertQueue(QUEUE, { durable: true });

    channel.consume(
        QUEUE,
        async (msg) => {
            if (!msg) return;

            const data = JSON.parse(msg.content.toString());
            const { jobId, status, result, error } = data;

            try {
                if (status === "PROCESSING") {
                    await pool.query(
                        `UPDATE jobs SET status = 'PROCESSING' WHERE id = $1`,
                        [jobId]
                    );
                }

                if (status === "DONE") {
                    await pool.query(
                        `UPDATE jobs SET status = 'DONE', result = $1 WHERE id = $2`,
                        [result, jobId]
                    );
                }

                if (status === "FAILED") {
                    await pool.query(
                        `UPDATE jobs SET status = 'FAILED', error = $1 WHERE id = $2`,
                        [error, jobId]
                    );
                }
            } catch (err) {
                console.error("Event error:", err);
            }

            channel.ack(msg);
        },
        { noAck: false }
    );

    console.log("📡 Events consumer started");
};