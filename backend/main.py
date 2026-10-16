from typing import Annotated

from fastapi import FastAPI, Query
from sqlmodel import select
from database.engine import SessionDep, create_db_and_tables
from models.user import User
from routes.analysis_routes import router as analysis_router
from routes.users import router as users_router
from fastapi.middleware.cors import CORSMiddleware
from fastapi_pagination import add_pagination

app = FastAPI(
    title="Inventory Analysis API",
    description="API para generar órdenes de compra usando Pandas y NumPy",
    version="1.0.0",
)
add_pagination(app)  # Add pagination to app


# CORS
origins = ["http://localhost:5173", "http://127.0.0.1:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registrar endpoints
app.include_router(analysis_router, prefix="/api", tags=["Analysis"])
app.include_router(users_router, prefix="/api", tags=["Users"])


@app.get("/")
async def root():
    return {"message": "API funcionando correctamente"}


@app.on_event("startup")
def on_startup():
    create_db_and_tables()
