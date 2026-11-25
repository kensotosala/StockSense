from typing import Annotated

from fastapi import Depends
from sqlalchemy import inspect, text
from sqlalchemy.engine import Engine
from sqlmodel import SQLModel, Session, create_engine

sqlite_file_name = "database.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

connect_args = {"check_same_thread": False}
engine = create_engine(sqlite_url, connect_args=connect_args)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)
    migrate_user_table(engine)


def migrate_user_table(database_engine: Engine) -> None:
    columns_to_add = {
        "email": "VARCHAR(254)",
        "phone_number": "VARCHAR(30)",
        "job_title": "VARCHAR(100)",
        "department": "VARCHAR(100)",
        "company_name": "VARCHAR(150)",
        "is_active": "BOOLEAN NOT NULL DEFAULT 1",
        "is_verified": "BOOLEAN NOT NULL DEFAULT 0",
        "created_at": "DATETIME",
        "updated_at": "DATETIME",
        "last_login_at": "DATETIME",
    }

    with database_engine.begin() as connection:
        columns = {
            column["name"] for column in inspect(connection).get_columns("user")
        }
        for column_name, column_definition in columns_to_add.items():
            if column_name not in columns:
                connection.execute(
                    text(
                        f'ALTER TABLE "user" ADD COLUMN "{column_name}" '
                        f"{column_definition}"
                    )
                )

        for column_name in ("created_at", "updated_at"):
            connection.execute(
                text(
                    f'UPDATE "user" SET "{column_name}" = CURRENT_TIMESTAMP '
                    f'WHERE "{column_name}" IS NULL'
                )
            )

        connection.execute(
            text(
                'CREATE UNIQUE INDEX IF NOT EXISTS "ix_user_email" '
                'ON "user" ("email")'
            )
        )


def get_session():
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_session)]
