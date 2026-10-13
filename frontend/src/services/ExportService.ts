import type { InventoryReportItem } from "../types/inventory";

const API_URL = "http://127.0.0.1:8000";

async function getErrorMessage(
  response: Response,
  defaultMessage: string,
): Promise<string> {
  try {
    const error = await response.json();
    return error.detail ?? defaultMessage;
  } catch {
    return defaultMessage;
  }
}

function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;

  document.body.appendChild(link);
  link.click();
  link.remove();

  // Liberar el recurso después de iniciar la descarga.
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Exporta el reporte de inventario a PDF.
 * Envía todos los registros recibidos al backend.
 */
export async function DownloadPDFReport(
  data: InventoryReportItem[],
): Promise<void> {
  if (!data.length) {
    throw new Error("No hay datos para exportar.");
  }

  const response = await fetch(`${API_URL}/api/download_pdf_report`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response, "No se pudo generar el PDF."),
    );
  }

  const blob = await response.blob();

  downloadBlob(blob, "reporte_inventario.pdf");
}

/**
 * Exporta el reporte de inventario a CSV.
 * Agrega BOM UTF-8 para mejorar la compatibilidad con Excel.
 */
export async function DownloadCSVReport(
  data: InventoryReportItem[],
): Promise<void> {
  if (!data.length) {
    throw new Error("No hay datos para exportar.");
  }

  const response = await fetch(`${API_URL}/api/download_csv_report`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response, "No se pudo generar el CSV."),
    );
  }

  const originalBlob = await response.blob();

  const blob = new Blob([new Uint8Array([0xef, 0xbb, 0xbf]), originalBlob], {
    type: "text/csv;charset=utf-8;",
  });

  downloadBlob(blob, "reporte_inventario.csv");
}
