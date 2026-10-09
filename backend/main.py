from fastapi import FastAPI
from routes.analysis import router as analysis_router
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


@app.get("/")
async def root():
    return {"message": "API funcionando correctamente"}
