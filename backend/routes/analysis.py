from io import BytesIO
from typing import Any

import pandas as pd
from fastapi import APIRouter, File, Form, UploadFile
from fastapi.responses import StreamingResponse
from fastapi_pagination import Page, paginate

from services.order_processor import generar_orden
from services.report_export import exportar_pdf
from services.report_generator import generar_reporte

router = APIRouter()


async def _read_csv(file: UploadFile) -> pd.DataFrame:
    content = await file.read()

    return pd.read_csv(
        BytesIO(content),
        delimiter=";",
    )


async def _generate_report(
    sells: UploadFile,
    actual_inventory: UploadFile,
    inventory_history_days: int,
    coverage_days: int,
    buffer_days: int,
    lead_time: int,
):
    sells_df = await _read_csv(sells)
    actual_inventory_df = await _read_csv(actual_inventory)

    resultado = generar_orden(
        plazo_historial_inventario=inventory_history_days,
        dias_cobertura=coverage_days,
        dias_colchon=buffer_days,
        lead_time=lead_time,
        ventas_articulos=sells_df,
        inventario_actual=actual_inventory_df,
    )

    return generar_reporte(
        resultado,
        "ALL_SPORT",
    )


@router.post(
    "/analysis",
    response_model=Page[dict[str, Any]],
)
async def analyze_data(
    sells: UploadFile = File(...),
    actual_inventory: UploadFile = File(...),
    inventory_history_days: int = Form(201),
    coverage_days: int = Form(270),
    buffer_days: int = Form(25),
    lead_time: int = Form(30),
):
    reporte = await _generate_report(
        sells,
        actual_inventory,
        inventory_history_days,
        coverage_days,
        buffer_days,
        lead_time,
    )

    data = reporte["dataframe"].to_dict(orient="records")

    return paginate(data)


@router.post("/download_pdf_report")
async def download_pdf_report(
    sells: UploadFile = File(...),
    actual_inventory: UploadFile = File(...),
    inventory_history_days: int = Form(201),
    coverage_days: int = Form(270),
    buffer_days: int = Form(25),
    lead_time: int = Form(30),
):
    reporte = await _generate_report(
        sells,
        actual_inventory,
        inventory_history_days,
        coverage_days,
        buffer_days,
        lead_time,
    )

    datos = {
        "data": reporte["dataframe"].to_dict(orient="records"),
        "registros": reporte["registros"],
    }

    pdf_buffer, file_name = exportar_pdf(datos)

    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={
            "Content-Disposition": (f'attachment; filename="{file_name}"'),
        },
    )
