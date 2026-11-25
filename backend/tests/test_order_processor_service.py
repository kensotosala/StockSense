import unittest

import pandas as pd

from services.order_processor_service import generar_orden


class GenerarOrdenTests(unittest.TestCase):
    def setUp(self):
        self.ventas = pd.DataFrame(
            {
                "CODIGO": [1.0, 1.0, 2],
                "DESCRIPCION": ["", "Producto uno", "Solo ventas"],
                "CANTIDAD": [4, 2, 3],
            }
        )
        self.inventario = pd.DataFrame(
            {
                "CODIGO": ["1", 3],
                "DESCRIPCION": ["Producto uno inventario", "Solo inventario"],
                "EXISTENCIA": [5, 9],
            }
        )

    def test_agrupa_productos_y_aplica_formulas_de_reposicion(self):
        resultado = generar_orden(
            10,
            20,
            2,
            3,
            self.ventas,
            self.inventario,
        )
        por_codigo = resultado.set_index("CODIGO")

        self.assertEqual(set(por_codigo.index), {"1", "2", "3"})
        self.assertEqual(por_codigo.loc["1", "CANTIDAD"], 6)
        self.assertEqual(por_codigo.loc["1", "EXISTENCIA"], 5)
        self.assertEqual(por_codigo.loc["1", "DEMANDA DIARIA"], 0.6)
        self.assertEqual(por_codigo.loc["1", "DEMANDA MENSUAL"], 18)
        self.assertEqual(por_codigo.loc["1", "STOCK SEGURIDAD"], 2)
        self.assertEqual(por_codigo.loc["1", "PUNTO DE REORDEN"], 4)
        self.assertEqual(por_codigo.loc["1", "CANTIDAD A ORDENAR"], 7)
        self.assertEqual(por_codigo.loc["3", "CANTIDAD A ORDENAR"], 0)

    def test_rechaza_parametros_de_dias_invalidos(self):
        casos = [
            {"plazo_historial_inventario": 0},
            {"dias_cobertura": -1},
            {"dias_colchon": -1},
            {"lead_time": 1.5},
        ]
        parametros = {
            "plazo_historial_inventario": 10,
            "dias_cobertura": 20,
            "dias_colchon": 2,
            "lead_time": 3,
            "ventas_articulos": self.ventas,
            "inventario_actual": self.inventario,
        }

        for cambio in casos:
            with self.subTest(cambio=cambio), self.assertRaises(ValueError):
                generar_orden(**(parametros | cambio))

    def test_rechaza_cantidades_invalidas_en_vez_de_ignorarlas(self):
        for cantidad in ("not-a-number", float("inf"), -1):
            ventas_invalidas = self.ventas.copy()
            ventas_invalidas["CANTIDAD"] = ventas_invalidas["CANTIDAD"].astype(object)
            ventas_invalidas.loc[0, "CANTIDAD"] = cantidad

            with self.subTest(cantidad=cantidad), self.assertRaisesRegex(
                ValueError,
                "CANTIDAD",
            ):
                generar_orden(
                    10,
                    20,
                    2,
                    3,
                    ventas_invalidas,
                    self.inventario,
                )

    def test_rechaza_columnas_requeridas_ausentes(self):
        with self.assertRaisesRegex(ValueError, "EXISTENCIA"):
            generar_orden(
                10,
                20,
                2,
                3,
                self.ventas,
                self.inventario.drop(columns=["EXISTENCIA"]),
            )

    def test_archivos_sin_filas_devuelven_reporte_vacio_con_esquema_estable(self):
        resultado = generar_orden(
            10,
            20,
            2,
            3,
            pd.DataFrame(columns=["CODIGO", "DESCRIPCION", "CANTIDAD"]),
            pd.DataFrame(columns=["CODIGO", "DESCRIPCION", "EXISTENCIA"]),
        )

        self.assertTrue(resultado.empty)
        self.assertEqual(
            list(resultado.columns),
            [
                "CODIGO",
                "DESCRIPCION",
                "CANTIDAD",
                "DEMANDA MENSUAL",
                "DEMANDA DIARIA",
                "STOCK SEGURIDAD",
                "PUNTO DE REORDEN",
                "EXISTENCIA",
                "CANTIDAD A ORDENAR",
            ],
        )


if __name__ == "__main__":
    unittest.main()
