import os

SECRET_KEY = "a5d7eeda87b8eadd043c52470bb4d6b8b78b5c5721fae5f938370ece2c63de8f"
if not SECRET_KEY:
    raise RuntimeError(
        "Set the SECRET_KEY environment variable before starting the API."
    )
if len(SECRET_KEY) < 32:
    raise RuntimeError("SECRET_KEY must contain at least 32 characters.")

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
