from typing import Annotated
from database.engine import SessionDep
from fastapi import Depends, Query
from sqlmodel import select
from core.security import get_current_user, get_password_hash
from models.user import User
from models.user import UserCreate
from schemas.user import UserPublic

from fastapi import APIRouter

router = APIRouter()

model = "users"


# List Users
@router.get(
    "/{model}/",
    response_model=list[UserPublic],
    dependencies=[Depends(get_current_user)],
)
def read_users(
    session: SessionDep,
    offset: int = 0,
    limit: Annotated[int, Query(le=100)] = 100,
) -> list[UserPublic]:
    heroes = session.exec(select(User).offset(offset).limit(limit)).all()
    return heroes


# Create User
@router.post("/{model}/", response_model=UserPublic)
def create_user(user: UserCreate, session: SessionDep) -> UserPublic:
    user_data = user.model_dump()
    user_data["password"] = get_password_hash(user_data["password"])

    db_user = User(**user_data)

    session.add(db_user)
    session.commit()
    session.refresh(db_user)

    return db_user
