"""
SARAS — Custom Exception Handler & Pagination
"""
from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
import logging

logger = logging.getLogger('saras')


def custom_exception_handler(exc, context):
    """
    Standardized error response format across all API endpoints.
    Response shape: { success: false, error: { code, message, details } }
    """
    response = exception_handler(exc, context)

    if response is not None:
        error_data = {
            'success': False,
            'error': {
                'code': _get_error_code(response.status_code),
                'message': _extract_message(response.data),
                'details': response.data if isinstance(response.data, dict) else {},
            }
        }
        response.data = error_data
    else:
        # Unhandled exceptions — log and return 500
        logger.exception(f"Unhandled exception in {context.get('view', 'unknown')}: {exc}")
        response = Response(
            {
                'success': False,
                'error': {
                    'code': 'INTERNAL_ERROR',
                    'message': 'An internal server error occurred. Please try again.',
                    'details': {},
                }
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    return response


def _get_error_code(status_code):
    codes = {
        400: 'BAD_REQUEST',
        401: 'UNAUTHORIZED',
        403: 'FORBIDDEN',
        404: 'NOT_FOUND',
        405: 'METHOD_NOT_ALLOWED',
        409: 'CONFLICT',
        422: 'VALIDATION_ERROR',
        429: 'RATE_LIMITED',
        500: 'INTERNAL_ERROR',
    }
    return codes.get(status_code, 'ERROR')


def _extract_message(data):
    if isinstance(data, dict):
        if 'detail' in data:
            return str(data['detail'])
        if 'non_field_errors' in data:
            errors = data['non_field_errors']
            return str(errors[0]) if errors else 'Validation error'
    if isinstance(data, list) and data:
        return str(data[0])
    return 'An error occurred'


class StandardPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100

    def get_paginated_response(self, data):
        from rest_framework.response import Response
        return Response({
            'success': True,
            'count': self.page.paginator.count,
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'total_pages': self.page.paginator.num_pages,
            'current_page': self.page.number,
            'results': data,
        })
