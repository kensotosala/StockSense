import unittest
from unittest.mock import patch

from sqlalchemy import create_engine, inspect, text
from sqlmodel import SQLModel, Session

from database.engine import migrate_user_table
from models.user import User
from schemas.user import UserPublic
from services.auth_service import authenticate_user


class UserModelTests(unittest.TestCase):
    def test_migrates_existing_user_table_without_losing_users(self):
        engine = create_engine("sqlite://")
        with engine.begin() as connection:
            connection.execute(
                text(
                    'CREATE TABLE "user" (id INTEGER PRIMARY KEY, '
                    "user_name VARCHAR NOT NULL UNIQUE, password VARCHAR NOT NULL, "
                    "first_name VARCHAR NOT NULL, last_name VARCHAR NOT NULL)"
                )
            )
            connection.execute(
                text(
                    'INSERT INTO "user" (user_name, password, first_name, last_name) '
                    "VALUES ('legacy', 'hash', 'Legacy', 'User')"
                )
            )

        migrate_user_table(engine)

        with engine.connect() as connection:
            columns = {
                column["name"] for column in inspect(connection).get_columns("user")
            }
            row = connection.execute(
                text(
                    'SELECT is_active, is_verified, created_at, updated_at '
                    'FROM "user" WHERE user_name = :username'
                ),
                {"username": "legacy"},
            ).one()

        self.assertTrue(
            {
                "email",
                "phone_number",
                "job_title",
                "department",
                "company_name",
                "last_login_at",
            }.issubset(columns)
        )
        self.assertEqual(row[0:2], (1, 0))
        self.assertTrue(row[2])
        self.assertTrue(row[3])

    def test_public_user_hides_contact_and_authentication_fields(self):
        engine = create_engine("sqlite://")
        SQLModel.metadata.create_all(engine)

        with Session(engine) as session:
            user = User(
                user_name="employee",
                password="hashed-password",
                first_name="Sam",
                last_name="Taylor",
                email="sam@example.com",
                phone_number="555-0100",
                job_title="Analyst",
            )
            session.add(user)
            session.commit()
            session.refresh(user)

            public_data = UserPublic.model_validate(user).model_dump()

        self.assertEqual(public_data["job_title"], "Analyst")
        self.assertNotIn("email", public_data)
        self.assertNotIn("phone_number", public_data)
        self.assertNotIn("password", public_data)

    def test_inactive_users_cannot_authenticate(self):
        engine = create_engine("sqlite://")
        SQLModel.metadata.create_all(engine)

        with Session(engine) as session:
            session.add(
                User(
                    user_name="disabled",
                    password="hashed-password",
                    first_name="Sam",
                    last_name="Taylor",
                    is_active=False,
                )
            )
            session.commit()

            with patch("services.auth_service.verify_password", return_value=True):
                self.assertIsNone(
                    authenticate_user(session, "disabled", "any-password")
                )


if __name__ == "__main__":
    unittest.main()
