import pandas as pd
import numpy as np


def generar_orden(
    plazo_historial_inventario,
    dias_cobertura,
    dias_colchon,
    lead_time,
    ventas_articulos: pd.DataFrame,
    inventario_actual: pd.DataFrame,
):

    ventas_articulos = ventas_articulos[["CODIGO", "DESCRIPCION", "CANTIDAD"]].copy()

    inventario_actual = inventario_actual[
        ["CODIGO", "DESCRIPCION", "EXISTENCIA"]
    ].copy()

    # Limpieza

    ventas_articulos = ventas_articulos.drop_duplicates()
    ventas_articulos = ventas_articulos.dropna()

    # Demanda

    ventas_articulos["DEMANDA MENSUAL"] = np.ceil(
        ventas_articulos["CANTIDAD"] / 30
    ).astype(int)

    ventas_articulos["DEMANDA DIARIA"] = (
        ventas_articulos["CANTIDAD"] / plazo_historial_inventario
    ).round(2)

    # Stock seguridad

    ventas_articulos["STOCK SEGURIDAD"] = np.ceil(
        ventas_articulos["DEMANDA DIARIA"] * dias_colchon
    ).astype(int)

    # Punto reorden

    ventas_articulos["PUNTO DE REORDEN"] = (
        ventas_articulos["DEMANDA DIARIA"] * lead_time
        + ventas_articulos["STOCK SEGURIDAD"]
    ).round(0)

    # Inventario

    ventas_articulos = ventas_articulos.merge(
        inventario_actual[["CODIGO", "EXISTENCIA"]], on="CODIGO", how="left"
    )

    ventas_articulos["EXISTENCIA"] = ventas_articulos["EXISTENCIA"].fillna(0)

    # Orden sugerida

    ventas_articulos["CANTIDAD A ORDENAR"] = (
        np.ceil(
            (ventas_articulos["DEMANDA DIARIA"] * dias_cobertura)
            - ventas_articulos["EXISTENCIA"]
        )
        .clip(lower=0)
        .astype(int)
    )

    return ventas_articulos.sort_values(by="DESCRIPCION")
