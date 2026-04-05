import os
import redis.asyncio as redis
import json

REDIS_URL = os.environ.get('REDIS_URL', 'redis://localhost:6379/0')
redis_client = redis.from_url(REDIS_URL, decode_responses=True)

async def publish_event(channel: str, message: dict):
    await redis_client.publish(channel, json.dumps(message))

async def get_test_timer(attempt_id: str):
    val = await redis_client.get(f"saras:timer:{attempt_id}")
    return int(val) if val else None

async def set_test_timer(attempt_id: str, seconds: int):
    await redis_client.setex(f"saras:timer:{attempt_id}", seconds, seconds)

def get_redis_client():
    return redis_client
