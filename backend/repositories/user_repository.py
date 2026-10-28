from sqlmodel import Session, select

from models.user import User


def get_user(session: Session, username: str) -> User | None:
    statement = select(User).where(User.user_name == username)
    return session.exec(statement).first()
