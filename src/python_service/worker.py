import pika
import json
import time
import random
import os
from dotenv import load_dotenv
from datetime import datetime, timezone

load_dotenv()
RABBIT_URL = os.getenv("RABBITMQ_URL")
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


def heavy_report_generation():
    tasks = [random.choice(["todo", "in_progress", "done"]) for _ in range(1_000_000)]

    total = len(tasks)
    done = tasks.count("done")
    in_progress = tasks.count("in_progress")
    todo = tasks.count("todo")

    return {
        "total": total,
        "done": done,
        "in_progress": in_progress,
        "todo": todo
    }

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
            "timestamp": now_time(),
            "jobId": job_id,
        })

        result = heavy_report_generation()

        publish_event(ch, {
            "eventType": "job.completed",
            "timestamp": now_time(),
            "jobId": job_id,
            "result": result
        })

    except Exception as e:
        publish_event(ch, {
            "eventType": "job.failed",
            "timestamp": now_time(),
            "jobId": job_id,
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