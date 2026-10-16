from typing import Annotated
from datetime import datetime, timezone
from sqlmodel import Field, SQLModel


class UserBase(SQLModel):
    user_name: str = Field(index=True, unique=True)
    password: str
    first_name: str = Field(index=True)
    last_name: str = Field(index=True)


class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    user_name: str = Field(index=True, unique=True)
    password: str
    first_name: str = Field(index=True)
    last_name: str = Field(index=True)


class UserCreate(UserBase):
    pass
