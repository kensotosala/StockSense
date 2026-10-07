import io
from datetime import datetime

from jinja2 import Environment, FileSystemLoader
from xhtml2pdf import pisa

env = Environment(
    loader=FileSystemLoader("."),
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
