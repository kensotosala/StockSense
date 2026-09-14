from fastapi import FastAPI
from routes.analysis import router as analysis_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Inventory Analysis API",
    description="API para generar órdenes de compra usando Pandas y NumPy",
    version="1.0.0",
)

# CORS
origins = ["http://localhost:5173"]

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
