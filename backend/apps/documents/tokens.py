"""
SARAS — Document Serve Token Service
=====================================
Generates short-lived (5 minutes) signed tokens for document access.

Why tokens?
- Document serve URLs are not permanent
- Prevents link sharing as a bypass
- Each token is user + document specific
- Expires after 5 minutes

Token contains:
- user_id: Who is requesting access
- document_id: Which document they want
- exp: Expiry timestamp (5 minutes from issue)
"""

import logging
from datetime import datetime, timedelta, timezone
from typing import Optional, Dict
from jose import JWTError, jwt
from django.conf import settings

logger = logging.getLogger('saras')


class ServeTokenService:
    """Manages document serve tokens."""
    
    def __init__(self):
        self.secret_key = settings.SECRET_KEY
        self.algorithm = 'HS256'
        self.expiry_minutes = settings.SERVE_TOKEN_EXPIRY_MINUTES
    
    def issue_token(self, user_id: str, document_id: str) -> str:
        """
        Issue a new serve token.
        
        Args:
            user_id: UUID of the user requesting access
            document_id: UUID of the document to access
        
        Returns:
            Signed JWT token string
        """
        now = datetime.now(tz=timezone.utc)
        expiry = now + timedelta(minutes=self.expiry_minutes)
        
        payload = {
            'user_id': str(user_id),
            'document_id': str(document_id),
            'iat': now.timestamp(),
            'exp': expiry.timestamp(),
        }
        
        token = jwt.encode(payload, self.secret_key, algorithm=self.algorithm)
        
        logger.debug(f"Serve token issued: user={user_id}, doc={document_id}, expires_in={self.expiry_minutes}min")
        
        return token
    
    def validate_token(self, token: str) -> Optional[Dict]:
        """
        Validate a serve token.
        
        Args:
            token: JWT token string
        
        Returns:
            Decoded payload dict if valid, None if invalid/expired
        """
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
            return payload
        except JWTError as e:
            logger.warning(f"Serve token validation failed: {e}")
            return None
    
    def get_serve_url(self, document_id: str, token: str) -> str:
        """
        Build full serve URL with token.
        
        Args:
            document_id: Document UUID
            token: Serve token
        
        Returns:
            Full URL string (relative path)
        """
        return f"/api/documents/{document_id}/serve/?token={token}"


# Singleton instance
serve_token_service = ServeTokenService()
