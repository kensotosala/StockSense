from fastapi import FastAPI
from routes.analysis import router as analysis_router

app = FastAPI(
    title="Inventory Analysis API",
    description="API para generar órdenes de compra usando Pandas y NumPy",
    version="1.0.0",
)


# Registrar endpoints
app.include_router(analysis_router, prefix="/api", tags=["Analysis"])


@app.get("/")
async def root():
    return {"message": "API funcionando correctamente"}
