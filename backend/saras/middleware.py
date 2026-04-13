"""
SARAS — Custom Middleware
Security headers + Login audit logging
"""
import logging
import time
from django.conf import settings

logger = logging.getLogger('saras')


class SecurityHeadersMiddleware:
    """
    Injects privacy and security HTTP response headers on every response.
    Critical for document privacy — prevents caching, framing, and sniffing.
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)

        # Prevent caching of all API responses
        if request.path.startswith('/api/'):
            response['Cache-Control'] = 'no-store, no-cache, must-revalidate, private'
            response['Pragma'] = 'no-cache'
            response['Expires'] = '0'

        # Document serve endpoint — maximum privacy headers
        if request.path.startswith('/api/documents/') and 'serve' in request.path:
            response['Cache-Control'] = 'no-store, no-cache, must-revalidate, private, max-age=0'
            response['Content-Disposition'] = 'inline'  # Never attachment/download
            response['X-Content-Type-Options'] = 'nosniff'
            response['X-Frame-Options'] = 'ALLOWALL'
            allowed_origins = " ".join(settings.CORS_ALLOWED_ORIGINS)
            response['Content-Security-Policy'] = (
                "default-src 'self'; "
                "script-src 'none'; "
                "object-src 'none'; "
                "plugin-types application/pdf; "
                "frame-ancestors *;"
            )
            response['X-Download-Options'] = 'noopen'
            response['X-Permitted-Cross-Domain-Policies'] = 'none'

        # Global security headers
        response['X-Content-Type-Options'] = 'nosniff'
        response['Referrer-Policy'] = 'strict-origin-when-cross-origin'
        response['Permissions-Policy'] = 'camera=(), microphone=(), geolocation=()'

        return response


class LoginAuditMiddleware:
    """
    Tracks request metadata for login audit logging.
    Attaches IP and user-agent to request object for use in auth views.
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Attach client metadata to request
        request.client_ip = self._get_client_ip(request)
        request.user_agent = request.META.get('HTTP_USER_AGENT', '')[:500]

        start_time = time.time()
        response = self.get_response(request)

        # Log slow API requests for monitoring
        duration = time.time() - start_time
        if duration > 2.0 and request.path.startswith('/api/'):
            logger.warning(
                f"Slow request: {request.method} {request.path} "
                f"took {duration:.2f}s from {request.client_ip}"
            )

        return response

    def _get_client_ip(self, request):
        """Extract real client IP, handling proxies."""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            return x_forwarded_for.split(',')[0].strip()
        return request.META.get('REMOTE_ADDR', '0.0.0.0')
