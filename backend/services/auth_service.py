import logging

from pwdlib.exceptions import UnknownHashError
from sqlmodel import Session

from core.security import verify_password
from models.user import User
from repositories.user_repository import get_user

logger = logging.getLogger(__name__)


def authenticate_user(
    session: Session,
    username: str,
    password: str,
) -> User | None:
    user = get_user(session, username)
    if user is None:
        return None

    try:
        password_matches = verify_password(password, user.password)
    except UnknownHashError:
        logger.warning(
            "Stored password for user %s is not a supported hash; password reset is required.",
            username,
        )
        return None

    return user if password_matches else None