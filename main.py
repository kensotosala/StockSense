from fastapi import FastAPI

app = FastAPI()


@app.get("/")
async def home():
    return {"message": "Welcome to the FastAPI application!"}


# https://www.youtube.com/watch?v=7AMjmCTumuo&t=354s
