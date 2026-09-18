import pandas as pd
from pathlib import Path


def generar_reporte(dataframe: pd.DataFrame, marca: str):

    carpeta = Path("reports")

    carpeta.mkdir(exist_ok=True)

    excel_path = carpeta / f"{marca}_reporte.xlsx"
    html_path = carpeta / f"{marca}_reporte.html"

    dataframe.to_excel(excel_path, index=False)

    dataframe.to_html(html_path, index=False)

    return {
        "dataframe": dataframe,
        "excel": str(excel_path),
        "html": str(html_path),
        "registros": len(dataframe),
    }
