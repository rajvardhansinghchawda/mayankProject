import os
import jwt
from fastapi import WebSocketException, status

SECRET_KEY = os.environ.get('FASTAPI_SECRET_KEY', os.environ.get('DJANGO_SECRET_KEY', 'dev-secret-key-change-in-production-min-64-chars-random-aabbccddeeff'))

async def verify_jwt_token(token: str) -> str:
    if not token:
        raise WebSocketException(code=status.WS_1008_POLICY_VIOLATION, reason="Missing token")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user_id = payload.get("user_id")
        if not user_id:
            raise WebSocketException(code=status.WS_1008_POLICY_VIOLATION, reason="Invalid token payload")
        return user_id
    except jwt.ExpiredSignatureError:
        raise WebSocketException(code=status.WS_1008_POLICY_VIOLATION, reason="Token expired")
    except jwt.PyJWTError:
        raise WebSocketException(code=status.WS_1008_POLICY_VIOLATION, reason="Invalid token")
