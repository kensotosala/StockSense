import pandas as pd
import numpy as np


def generar_orden(
    plazo_historial_inventario: int,
    dias_cobertura: int,
    dias_colchon: int,
    lead_time: int,
    ventas_articulos: pd.DataFrame,
    inventario_actual: pd.DataFrame,
) -> pd.DataFrame:

    # 1. Limpieza y Agrupación de Ventas (Garantiza un solo registro por CÓDIGO)
    ventas_limpio = (
        ventas_articulos[["CODIGO", "DESCRIPCION", "CANTIDAD"]].dropna().copy()
    )

    # Agrupar cantidades y mantener la primera descripción que encuentre
    ventas_agrupado = (
        ventas_limpio.groupby("CODIGO")
        .agg(CANTIDAD=("CANTIDAD", "sum"), DESCRIPCION=("DESCRIPCION", "first"))
        .reset_index()
    )

    # 2. Limpieza de Inventario Actual
    inventario_limpio = (
        inventario_actual[["CODIGO", "DESCRIPCION", "EXISTENCIA"]].dropna().copy()
    )
    inventario_agrupado = (
        inventario_limpio.groupby("CODIGO")
        .agg(EXISTENCIA=("EXISTENCIA", "sum"), DESCRIPCION_INV=("DESCRIPCION", "first"))
        .reset_index()
    )

    # 3. Unir Universo de Productos (Ventas + Inventario)
    # how="outer" asegura que si un artículo no tiene ventas pero sí inventario (o viceversa), se evalúe.
    df = pd.merge(ventas_agrupado, inventario_agrupado, on="CODIGO", how="outer")

    # Consolidar descripciones y rellenar nulos
    df["DESCRIPCION"] = (
        df["DESCRIPCION"].fillna(df["DESCRIPCION_INV"]).fillna("SIN DESCRIPCIÓN")
    )
    df["CANTIDAD"] = df["CANTIDAD"].fillna(0)
    df["EXISTENCIA"] = df["EXISTENCIA"].fillna(0)
    df = df.drop(columns=["DESCRIPCION_INV"])

    # 4. Cálculos de Demanda
    # Demanda Diaria basada en el plazo real del historial provisto
    df["DEMANDA DIARIA"] = (df["CANTIDAD"] / plazo_historial_inventario).round(4)

    # Demanda Mensual proporcional (Promedio de 30 días)
    df["DEMANDA MENSUAL"] = np.ceil(df["DEMANDA DIARIA"] * 30).astype(int)

    # 5. Stock de Seguridad y Punto de Reorden
    df["STOCK SEGURIDAD"] = np.ceil(df["DEMANDA DIARIA"] * dias_colchon).astype(int)

    df["PUNTO DE REORDEN"] = np.ceil(
        (df["DEMANDA DIARIA"] * lead_time) + df["STOCK SEGURIDAD"]
    ).astype(int)

    # 6. Cantidad Sugerida a Ordenar
    # Fórmula: Lo que necesito para cubrir los días - Lo que ya tengo en existencia
    df["CANTIDAD A ORDENAR"] = (
        np.ceil((df["DEMANDA DIARIA"] * dias_cobertura) - df["EXISTENCIA"])
        .clip(lower=0)
        .astype(int)
    )

    return df.sort_values(by="DESCRIPCION").reset_index(drop=True)
