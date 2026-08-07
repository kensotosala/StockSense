from fastapi import APIRouter, UploadFile, File
from io import BytesIO
import pandas as pd

from services.order_processor import generar_orden
from services.report_generator import generar_reporte

router = APIRouter()


@router.post("/analysis")
async def analyze_data(
    ventas: UploadFile = File(...),
    inventario_actual: UploadFile = File(...),
    plazo_historial_inventario: int = 201,
    dias_cobertura: int = 270,
    dias_colchon: int = 25,
    lead_time: int = 30,
):

    ventas_df = pd.read_csv(BytesIO(await ventas.read()), delimiter=";")

    inventario_df = pd.read_csv(BytesIO(await inventario_actual.read()), delimiter=";")

    resultado = generar_orden(
        plazo_historial_inventario=plazo_historial_inventario,
        dias_cobertura=dias_cobertura,
        dias_colchon=dias_colchon,
        lead_time=lead_time,
        ventas_articulos=ventas_df,
        inventario_actual=inventario_df,
    )

    reporte = generar_reporte(resultado, "ALL_SPORT")

    return reporte
