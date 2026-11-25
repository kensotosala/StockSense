from numbers import Integral

import numpy as np
import pandas as pd


def _validar_dias(nombre: str, valor: int, permitir_cero: bool = False) -> None:
    minimo = 0 if permitir_cero else 1
    if isinstance(valor, bool) or not isinstance(valor, Integral) or valor < minimo:
        condicion = "un entero no negativo" if permitir_cero else "un entero positivo"
        raise ValueError(f"{nombre} debe ser {condicion}.")


def _normalizar_codigo(codigo: object) -> str | None:
    if pd.isna(codigo):
        return None
    if isinstance(codigo, (float, np.floating)):
        if not np.isfinite(codigo):
            return None
        if codigo.is_integer():
            return str(int(codigo))
    if isinstance(codigo, Integral):
        return str(int(codigo))

    codigo_normalizado = str(codigo).strip()
    return codigo_normalizado or None


def _limpiar_articulos(
    datos: pd.DataFrame,
    nombre: str,
    columna_cantidad: str,
) -> pd.DataFrame:
    if not isinstance(datos, pd.DataFrame):
        raise TypeError(f"{nombre} debe ser un DataFrame de pandas.")
    columnas_requeridas = {"CODIGO", "DESCRIPCION", columna_cantidad}
    if datos.columns.duplicated().any():
        raise ValueError(f"{nombre} contiene nombres de columna duplicados.")

    faltantes = columnas_requeridas.difference(datos.columns)
    if faltantes:
        raise ValueError(
            f"{nombre} debe incluir las columnas: {', '.join(sorted(faltantes))}."
        )

    articulos = datos[["CODIGO", "DESCRIPCION", columna_cantidad]].copy()
    articulos["CODIGO"] = articulos["CODIGO"].map(_normalizar_codigo)
    codigos_invalidos = articulos["CODIGO"].isna()
    if codigos_invalidos.any():
        filas = articulos.index[codigos_invalidos].tolist()[:5]
        raise ValueError(f"{nombre} contiene códigos vacíos en las filas {filas}.")

    descripciones = articulos["DESCRIPCION"].astype("string").str.strip()
    articulos["DESCRIPCION"] = descripciones.mask(descripciones.eq(""), pd.NA)

    cantidades = pd.to_numeric(articulos[columna_cantidad], errors="coerce")
    if pd.api.types.is_complex_dtype(cantidades.dtype):
        raise ValueError(f"{nombre}.{columna_cantidad} debe contener números reales.")

    valores = cantidades.to_numpy(dtype=np.float64, na_value=np.nan)
    cantidades_invalidas = ~np.isfinite(valores)
    if cantidades_invalidas.any():
        filas = articulos.index[cantidades_invalidas].tolist()[:5]
        raise ValueError(
            f"{nombre}.{columna_cantidad} contiene valores vacíos, no numéricos "
            f"o no finitos en las filas {filas}."
        )

    if columna_cantidad == "CANTIDAD" and (cantidades < 0).any():
        filas = articulos.index[cantidades < 0].tolist()[:5]
        raise ValueError(
            f"{nombre}.CANTIDAD no puede ser negativa; filas inválidas: {filas}."
        )

    articulos[columna_cantidad] = cantidades
    return articulos


def generar_orden(
    plazo_historial_inventario: int,
    dias_cobertura: int,
    dias_colchon: int,
    lead_time: int,
    ventas_articulos: pd.DataFrame,
    inventario_actual: pd.DataFrame,
) -> pd.DataFrame:
    """Calcula demanda y sugerencias de compra por código de producto."""
    _validar_dias("plazo_historial_inventario", plazo_historial_inventario)
    _validar_dias("dias_cobertura", dias_cobertura)
    _validar_dias("dias_colchon", dias_colchon, permitir_cero=True)
    _validar_dias("lead_time", lead_time, permitir_cero=True)

    ventas_limpio = _limpiar_articulos(
        ventas_articulos,
        "ventas_articulos",
        "CANTIDAD",
    )
    inventario_limpio = _limpiar_articulos(
        inventario_actual,
        "inventario_actual",
        "EXISTENCIA",
    )

    ventas_agrupado = (
        ventas_limpio.groupby("CODIGO", as_index=False, sort=False)
        .agg(CANTIDAD=("CANTIDAD", "sum"), DESCRIPCION=("DESCRIPCION", "first"))
    )
    inventario_agrupado = (
        inventario_limpio.groupby("CODIGO", as_index=False, sort=False)
        .agg(
            EXISTENCIA=("EXISTENCIA", "sum"),
            DESCRIPCION_INV=("DESCRIPCION", "first"),
        )
    )

    df = pd.merge(
        ventas_agrupado,
        inventario_agrupado,
        on="CODIGO",
        how="outer",
        validate="one_to_one",
    )
    df["DESCRIPCION"] = (
        df["DESCRIPCION"]
        .combine_first(df["DESCRIPCION_INV"])
        .fillna("SIN DESCRIPCIÓN")
    )
    df["CANTIDAD"] = df["CANTIDAD"].fillna(0)
    df["EXISTENCIA"] = df["EXISTENCIA"].fillna(0)
    df = df.drop(columns=["DESCRIPCION_INV"])

    df["DEMANDA DIARIA"] = (
        df["CANTIDAD"] / plazo_historial_inventario
    ).round(4)
    df["DEMANDA MENSUAL"] = np.ceil(df["DEMANDA DIARIA"] * 30).astype(int)
    df["STOCK SEGURIDAD"] = np.ceil(
        df["DEMANDA DIARIA"] * dias_colchon
    ).astype(int)
    df["PUNTO DE REORDEN"] = np.ceil(
        (df["DEMANDA DIARIA"] * lead_time) + df["STOCK SEGURIDAD"]
    ).astype(int)
    df["CANTIDAD A ORDENAR"] = (
        np.ceil((df["DEMANDA DIARIA"] * dias_cobertura) - df["EXISTENCIA"])
        .clip(lower=0)
        .astype(int)
    )

    columnas_salida = [
        "CODIGO",
        "DESCRIPCION",
        "CANTIDAD",
        "DEMANDA MENSUAL",
        "DEMANDA DIARIA",
        "STOCK SEGURIDAD",
        "PUNTO DE REORDEN",
        "EXISTENCIA",
        "CANTIDAD A ORDENAR",
    ]
    return (
        df[columnas_salida]
        .sort_values(by="DESCRIPCION", kind="stable")
        .reset_index(drop=True)
    )
