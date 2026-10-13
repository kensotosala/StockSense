import io
from datetime import datetime
from pathlib import Path
import csv


from jinja2 import Environment, FileSystemLoader
from xhtml2pdf import pisa

BASE_DIR = Path(__file__).resolve().parent.parent

env = Environment(
    loader=FileSystemLoader(BASE_DIR),
)


def exportar_pdf(datos: dict) -> tuple[io.BytesIO, str]:

    template = env.get_template("reports/invoice.html")

    html = template.render(**datos)

    pdf_buffer = io.BytesIO()

    result = pisa.CreatePDF(
        src=html,
        dest=pdf_buffer,
    )

    if result.err:
        raise RuntimeError("No se pudo generar el PDF")

    pdf_buffer.seek(0)

    file_name = f"report_{datetime.now():%Y%m%d_%H%M%S}.pdf"

    return pdf_buffer, file_name


def exportar_csv(
    datos: list[dict],
) -> tuple[io.BytesIO, str]:
    text_buffer = io.StringIO(newline="")

    if datos:
        columnas = list(datos[0].keys())

        writer = csv.DictWriter(
            text_buffer,
            fieldnames=columnas,
            delimiter=";",
            extrasaction="ignore",
        )

        writer.writeheader()
        writer.writerows(datos)

    csv_buffer = io.BytesIO(text_buffer.getvalue().encode("utf-8-sig"))

    csv_buffer.seek(0)

    file_name = f"report_{datetime.now():%Y%m%d_%H%M%S}.csv"

    return csv_buffer, file_name
