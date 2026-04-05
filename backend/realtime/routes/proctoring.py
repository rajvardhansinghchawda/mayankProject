import json
import asyncio
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from realtime.deps import verify_jwt_token
from realtime.services.redis_service import get_redis_client

router = APIRouter()

@router.websocket("/ws/proctor/{test_id}/")
async def proctor_websocket(websocket: WebSocket, test_id: str, token: str):
    user_id = await verify_jwt_token(token)
    await websocket.accept()

    redis_client = get_redis_client()
    pubsub = redis_client.pubsub()
    
    # We could restrict to a specific test_id channel: saras:proctor_channel:{test_id}
    proctor_channel = f"saras:proctor_channel:global" 
    await pubsub.subscribe(proctor_channel)

    try:
        while True:
            message = await pubsub.get_message(ignore_subscribe_messages=True, timeout=1.0)
            if message:
                data = message['data']
                await websocket.send_text(data)
                
            try:
                client_data = await asyncio.wait_for(websocket.receive_text(), timeout=0.1)
            except asyncio.TimeoutError:
                pass
                
    except WebSocketDisconnect:
        await pubsub.unsubscribe(proctor_channel)
