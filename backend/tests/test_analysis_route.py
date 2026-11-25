import unittest

from fastapi import FastAPI
from fastapi.testclient import TestClient

from core.security import get_current_user
from routes.analysis import router as analysis_router
from routes.users import router as users_router


class AnalysisRouteTests(unittest.TestCase):
    def setUp(self):
        app = FastAPI()
        app.include_router(analysis_router, prefix="/api")
        app.include_router(users_router, prefix="/api")
        app.dependency_overrides[get_current_user] = lambda: object()
        self.client = TestClient(app)

    def test_analysis_route_processes_uploaded_csv_files(self):
        response = self.client.post(
            "/api/analysis/",
            files={
                "sells": (
                    "ventas.csv",
                    " CODIGO ; DESCRIPCION ; CANTIDAD \n A1 ; Producto A ; 6\n",
                    "text/csv",
                ),
                "actual_inventory": (
                    "inventario.csv",
                    "CODIGO; REFERENCIA; DESCRIPCION; EXISTENCIA\n"
                    "A1; A1; Producto A; 5\n",
                    "text/csv",
                ),
            },
            data={
                "inventory_history_days": "10",
                "coverage_days": "20",
                "buffer_days": "2",
                "lead_time": "3",
            },
            headers={"Authorization": "Bearer test-token"},
        )

        self.assertEqual(response.status_code, 200)
        report = response.json()
        self.assertTrue(report["report_id"])
        self.assertEqual(report["total"], 1)
        self.assertEqual(report["items"][0]["CANTIDAD A ORDENAR"], 7)

    def test_analysis_route_also_accepts_comma_delimited_csv_files(self):
        response = self.client.post(
            "/api/analysis/",
            files={
                "sells": (
                    "ventas.csv",
                    "CODIGO,DESCRIPCION,CANTIDAD\nA1,Producto A,6\n",
                    "text/csv",
                ),
                "actual_inventory": (
                    "inventario.csv",
                    "CODIGO,DESCRIPCION,EXISTENCIA\nA1,Producto A,5\n",
                    "text/csv",
                ),
            },
            data={
                "inventory_history_days": "10",
                "coverage_days": "20",
            },
            headers={"Authorization": "Bearer test-token"},
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["total"], 1)

    def test_analysis_route_rejects_files_without_required_columns(self):
        response = self.client.post(
            "/api/analysis/",
            files={
                "sells": ("ventas.csv", "CODIGO,CANTIDAD\nA1,6\n", "text/csv"),
                "actual_inventory": (
                    "inventario.csv",
                    "CODIGO,EXISTENCIA\nA1,5\n",
                    "text/csv",
                ),
            },
            data={
                "inventory_history_days": "10",
                "coverage_days": "20",
            },
            headers={"Authorization": "Bearer test-token"},
        )

        self.assertEqual(response.status_code, 422)
        self.assertIn("DESCRIPCION", response.json()["detail"])


if __name__ == "__main__":
    unittest.main()
