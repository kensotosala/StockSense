from fastapi import APIRouter, Form, UploadFile, File
from io import BytesIO
import pandas as pd

from services.order_processor import generar_orden
from services.report_generator import generar_reporte

router = APIRouter()


@router.post("/analysis")
@router.post("/analysis")
async def analyze_data(
    sells: UploadFile = File(...),
    actual_inventory: UploadFile = File(...),
    inventory_history_days: int = Form(201),
    coverage_days: int = Form(270),
    buffer_days: int = Form(25),
    lead_time: int = Form(30),
):

    sells_df = pd.read_csv(BytesIO(await sells.read()), delimiter=";")

    actual_inventory_df = pd.read_csv(
        BytesIO(await actual_inventory.read()), delimiter=";"
    )

    resultado = generar_orden(
        plazo_historial_inventario=inventory_history_days,
        dias_cobertura=coverage_days,
        dias_colchon=buffer_days,
        lead_time=lead_time,
        ventas_articulos=sells_df,
        inventario_actual=actual_inventory_df,
    )

    reporte = generar_reporte(resultado, "ALL_SPORT")

    return reporte
