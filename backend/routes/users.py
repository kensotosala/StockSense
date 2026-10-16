from typing import Annotated
from database.engine import SessionDep
from fastapi import Query
from sqlmodel import select
from models.user import User
from models.user import UserCreate

from fastapi import APIRouter

router = APIRouter()

model = "users"


# List Users
@router.get("/{model}/")
def read_users(
    session: SessionDep,
    offset: int = 0,
    limit: Annotated[int, Query(le=100)] = 100,
) -> list[User]:
    heroes = session.exec(select(User).offset(offset).limit(limit)).all()
    return heroes


# Create User
@router.post("/{model}/")
def create_user(user: UserCreate, session: SessionDep) -> User:
    user_data = user.model_dump()

    db_user = User(**user_data)

    session.add(db_user)
    session.commit()
    session.refresh(db_user)

    return db_user
