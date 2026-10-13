import logging
from typing import Optional

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field, ConfigDict

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


@router.post("/download_csv_report")
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


@router.post("/download_pdf_report")
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
