"""SARAS Password Validator — Enforces institutional password policy."""
import re
from django.core.exceptions import ValidationError
from django.utils.translation import gettext as _


class SARASPasswordValidator:
    """
    Password must contain:
    - At least 1 uppercase letter
    - At least 1 lowercase letter
    - At least 1 digit
    """
    def validate(self, password, user=None):
        errors = []
        
        if not re.search(r'[A-Z]', password):
            errors.append(_('Password must contain at least one uppercase letter.'))
        
        if not re.search(r'[a-z]', password):
            errors.append(_('Password must contain at least one lowercase letter.'))
        
        if not re.search(r'\d', password):
            errors.append(_('Password must contain at least one number.'))
        
        if errors:
            raise ValidationError(errors)

    def get_help_text(self):
        return _(
            'Your password must contain at least one uppercase letter, '
            'one lowercase letter, and one number.'
        )
