from sqlmodel import SQLModel


class UserPublic(SQLModel):
    user_name: str
    first_name: str
    last_name: str
