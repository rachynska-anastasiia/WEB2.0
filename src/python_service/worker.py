import pika
import json
import os
import time
from datetime import datetime, timezone

RABBIT_URL = os.environ.get("RABBITMQ_URL", "amqp://guest:guest@localhost:5672/")
REQUEST_QUEUE = "job.request"
EVENT_QUEUE = "job.events"


def now_time():
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.%f")[:-3] + "Z"


def connect():
    params = pika.URLParameters(RABBIT_URL)
    connection = pika.BlockingConnection(params)
    channel = connection.channel()

    channel.queue_declare(queue=REQUEST_QUEUE, durable=True)
    channel.queue_declare(queue=EVENT_QUEUE, durable=True)

    return connection, channel


def publish_event(channel, event):
    channel.basic_publish(
        exchange='',
        routing_key=EVENT_QUEUE,
        body=json.dumps(event),
        properties=pika.BasicProperties(delivery_mode=2)
    )


def handle_message(ch, method, properties, body):
    data = json.loads(body)
    job_id = data["jobId"]

    print(f"Processing job {job_id}")

    try:
        publish_event(ch, {
            "eventType": "job.progress",
            "jobId": job_id,
            "timestamp": now_time()
        })

        # heavy-processing
        time.sleep(5)

        publish_event(ch, {
            "eventType": "job.completed",
            "jobId": job_id,
            "timestamp": now_time(),
            "result": "Processed by Python service"
        })

    except Exception as e:
        publish_event(ch, {
            "eventType": "job.failed",
            "jobId": job_id,
            "timestamp": now_time(),
            "error": {"message": str(e)}
        })

    ch.basic_ack(delivery_tag=method.delivery_tag)


def main():
    connection, channel = connect()

    channel.basic_consume(
        queue=REQUEST_QUEUE,
        on_message_callback=handle_message,
        auto_ack=False
    )

    print("Python worker started")
    channel.start_consuming()


if __name__ == "__main__":
    main()