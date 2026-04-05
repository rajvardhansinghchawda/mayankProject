import json
import asyncio
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from realtime.deps import verify_jwt_token
from realtime.services.redis_service import publish_event, set_test_timer, get_test_timer

router = APIRouter()

@router.websocket("/ws/test/{attempt_id}/")
async def test_session_websocket(websocket: WebSocket, attempt_id: str, token: str):
    user_id = await verify_jwt_token(token)
    await websocket.accept()
    
    current_timer = await get_test_timer(attempt_id)
    if not current_timer:
        current_timer = 1800
        await set_test_timer(attempt_id, current_timer)

    try:
        while True:
            data = await websocket.receive_text()
            event = json.loads(data)
            
            event_type = event.get("type")
            proctor_channel = f"saras:proctor_channel:global" 

            if event_type == "heartbeat":
                current_timer = await get_test_timer(attempt_id)
                await websocket.send_json({"type": "timer_sync", "data": {"remaining_seconds": current_timer}})
            
            elif event_type in ["tab_switch", "fullscreen_exit", "focus_lost"]:
                await publish_event(proctor_channel, {
                    "attempt_id": attempt_id,
                    "user_id": user_id,
                    "event_type": event_type,
                    "data": event.get("data", {})
                })
                await websocket.send_json({"type": "warning", "data": {"message": f"{event_type} logged."}})
                
            elif event_type == "answer_saved":
                await publish_event(proctor_channel, {
                    "attempt_id": attempt_id,
                    "user_id": user_id,
                    "event_type": event_type,
                    "data": event.get("data", {})
                })

    except WebSocketDisconnect:
        pass
