import logging
from uuid import uuid4
from typing import Optional

import pandas as pd
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field, ConfigDict

from core.security import get_current_user
from services.order_processor_service import generar_orden
from services.report_export_service import exportar_csv, exportar_pdf

router = APIRouter()
logger = logging.getLogger(__name__)


class InventoryItem(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    CODIGO: str
    DESCRIPCION: Optional[str] = "SIN DESCRIPCIÓN"
    CANTIDAD: float
    DEMANDA_MENSUAL: float = Field(alias="DEMANDA MENSUAL")
    DEMANDA_DIARIA: float = Field(alias="DEMANDA DIARIA")
    STOCK_SEGURIDAD: float = Field(alias="STOCK SEGURIDAD")
    PUNTO_DE_REORDEN: float = Field(alias="PUNTO DE REORDEN")
    EXISTENCIA: float
    CANTIDAD_A_ORDENAR: float = Field(alias="CANTIDAD A ORDENAR")


class InventoryAnalysisResponse(BaseModel):
    report_id: str
    items: list[InventoryItem]
    total: int
    page: int
    size: int
    pages: int


def _read_csv(upload: UploadFile, label: str) -> pd.DataFrame:
    try:
        data = pd.read_csv(
            upload.file,
            sep=None,
            engine="python",
            skipinitialspace=True,
            encoding="utf-8-sig",
        )
        data.columns = data.columns.str.strip()
        return data
    except (
        pd.errors.EmptyDataError,
        pd.errors.ParserError,
        UnicodeDecodeError,
    ) as error:
        raise HTTPException(
            status_code=422,
            detail=f"El archivo de {label} no es un CSV válido: {error}",
        ) from error


@router.post(
    "/analysis/",
    response_model=InventoryAnalysisResponse,
    dependencies=[Depends(get_current_user)],
)
def analyze_inventory(
    sells: UploadFile = File(...),
    actual_inventory: UploadFile = File(...),
    inventory_history_days: int = Form(..., gt=0),
    coverage_days: int = Form(..., gt=0),
    buffer_days: int = Form(default=0, ge=0),
    lead_time: int = Form(default=0, ge=0),
) -> InventoryAnalysisResponse:
    sales_data = _read_csv(sells, "ventas")
    inventory_data = _read_csv(actual_inventory, "inventario")

    try:
        result = generar_orden(
            plazo_historial_inventario=inventory_history_days,
            dias_cobertura=coverage_days,
            dias_colchon=buffer_days,
            lead_time=lead_time,
            ventas_articulos=sales_data,
            inventario_actual=inventory_data,
        )
    except ValueError as error:
        raise HTTPException(status_code=422, detail=str(error)) from error

    items = result.to_dict(orient="records")
    total = len(items)
    return InventoryAnalysisResponse(
        report_id=uuid4().hex,
        items=items,
        total=total,
        page=1,
        size=total,
        pages=1 if total else 0,
    )


@router.post(
    "/download_csv_report",
    dependencies=[Depends(get_current_user)],
)
async def download_csv_report(
    reporte: list[InventoryItem],
):
    if not reporte:
        raise HTTPException(
            status_code=400,
            detail="El reporte enviado está vacío.",
        )

    datos_dict = [item.model_dump(by_alias=True) for item in reporte]

    csv_buffer, file_name = exportar_csv(datos_dict)

    return StreamingResponse(
        csv_buffer,
        media_type="text/csv; charset=utf-8",
        headers={
            "Content-Disposition": f'attachment; filename="{file_name}"',
            "Access-Control-Expose-Headers": "Content-Disposition",
        },
    )


@router.post(
    "/download_pdf_report",
    dependencies=[Depends(get_current_user)],
)
async def download_pdf_report(
    reporte: list[InventoryItem],
):
    if not reporte:
        raise HTTPException(
            status_code=400,
            detail="El reporte enviado está vacío.",
        )

    datos_dict = [item.model_dump(by_alias=True) for item in reporte]

    try:
        pdf_buffer, file_name = exportar_pdf(
            {
                "data": datos_dict,
            }
        )

        return StreamingResponse(
            pdf_buffer,
            media_type="application/pdf",
            headers={
                "Content-Disposition": (f'attachment; filename="{file_name}"'),
                "Access-Control-Expose-Headers": "Content-Disposition",
            },
        )

    except Exception as exc:
        logger.exception("Error al generar el PDF")

        raise HTTPException(
            status_code=500,
            detail=f"Error al generar PDF: {exc}",
        ) from exc
