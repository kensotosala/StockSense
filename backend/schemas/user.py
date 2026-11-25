from datetime import datetime

from sqlmodel import SQLModel


class UserPublic(SQLModel):
    id: int
    user_name: str
    first_name: str
    last_name: str
    job_title: str | None
    department: str | None
    company_name: str | None
    is_active: bool
    created_at: datetime
    updated_at: datetime
