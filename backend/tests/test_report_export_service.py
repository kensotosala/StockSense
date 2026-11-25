import unittest

from services.report_export_service import exportar_pdf


class PdfReportTests(unittest.TestCase):
    def test_exports_branded_inventory_report_as_pdf(self):
        pdf, filename = exportar_pdf(
            {
                "data": [
                    {
                        "CODIGO": "A1",
                        "DESCRIPCION": "Producto A",
                        "CANTIDAD": 6,
                        "DEMANDA MENSUAL": 18,
                        "DEMANDA DIARIA": 0.6,
                        "STOCK SEGURIDAD": 2,
                        "PUNTO DE REORDEN": 4,
                        "EXISTENCIA": 5,
                        "CANTIDAD A ORDENAR": 7,
                    }
                ]
            }
        )

        self.assertTrue(filename.startswith("report_"))
        self.assertEqual(pdf.read(4), b"%PDF")


if __name__ == "__main__":
    unittest.main()
