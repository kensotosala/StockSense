from datetime import datetime, timezone

from sqlmodel import Field, SQLModel


class UserBase(SQLModel):
    user_name: str = Field(index=True, unique=True)
    first_name: str = Field(index=True)
    last_name: str = Field(index=True)
    email: str | None = Field(default=None, max_length=254)
    phone_number: str | None = Field(default=None, max_length=30)
    job_title: str | None = Field(default=None, max_length=100)
    department: str | None = Field(default=None, max_length=100)
    company_name: str | None = Field(default=None, max_length=150)


class User(UserBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    password: str
    email: str | None = Field(default=None, max_length=254, unique=True, index=True)
    is_active: bool = Field(default=True, sa_column_kwargs={"server_default": "1"})
    is_verified: bool = Field(default=False, sa_column_kwargs={"server_default": "0"})
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column_kwargs={"onupdate": lambda: datetime.now(timezone.utc)},
    )
    last_login_at: datetime | None = Field(default=None)


class UserCreate(UserBase):
    password: str
