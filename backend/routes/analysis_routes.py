from typing import Any
from uuid import uuid4

import pandas as pd
from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from fastapi.responses import StreamingResponse

from services.order_processor_service import generar_orden
from services.report_export_service import exportar_pdf

router = APIRouter()

# Debe estar fuera de los endpoints para que ambos puedan acceder.
reports_cache: dict[str, dict[str, Any]] = {}


@router.post("/analysis")
async def analyze_data(
    sells: UploadFile = File(...),
    actual_inventory: UploadFile = File(...),
    inventory_history_days: int = Form(201),
    coverage_days: int = Form(270),
    buffer_days: int = Form(25),
    lead_time: int = Form(30),
):
    # Leer archivos CSV
    ventas_articulos = pd.read_csv(sells.file, sep=";")
    inventario_actual = pd.read_csv(
        actual_inventory.file,
        sep=";",
    )

    # Calcular el reporte completo una sola vez
    dataframe = generar_orden(
        plazo_historial_inventario=inventory_history_days,
        dias_cobertura=coverage_days,
        dias_colchon=buffer_days,
        lead_time=lead_time,
        ventas_articulos=ventas_articulos,
        inventario_actual=inventario_actual,
    )

    # Guardar TODOS los registros antes de paginar
    report_id = str(uuid4())
    records = dataframe.to_dict(orient="records")

    reports_cache[report_id] = {
        "data": records,
        "registros": len(records),
    }

    # The frontend paginates this complete list locally.
    return {
        "report_id": report_id,
        "items": records,
        "total": len(records),
        "page": 1,
        "size": len(records),
        "pages": 1,
    }


@router.get("/download_pdf_report/{report_id}")
async def download_pdf_report(report_id: str):
    # Recuperar el reporte completo sin volver a procesar CSV
    reporte = reports_cache.get(report_id)

    if reporte is None:
        raise HTTPException(
            status_code=404,
            detail="Reporte no encontrado o expirado.",
        )

    # Generar PDF con TODOS los registros
    pdf_buffer, file_name = exportar_pdf(reporte)

    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="{file_name}"',
        },
    )
