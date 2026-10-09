interface ExportPdfParams {
  sells: File;
  actualInventory: File;
  inventoryHistoryDays: number;
  coverageDays: number;
  bufferDays: number;
  leadTime: number;
}

export async function DownloadPDFReport(
  params: ExportPdfParams,
): Promise<void> {
  console.log("Parámetros recibidos para exportar:", params);
  console.log("sells:", params.sells);
  console.log("actualInventory:", params.actualInventory);
  console.log("inventoryHistoryDays:", params.inventoryHistoryDays);
  console.log("coverageDays:", params.coverageDays);
  console.log("bufferDays:", params.bufferDays);
  console.log("leadTime:", params.leadTime);

  const formData = new FormData();
  formData.append("sells", params.sells);
  formData.append("actual_inventory", params.actualInventory);
  formData.append(
    "inventory_history_days",
    String(params.inventoryHistoryDays),
  );
  formData.append("coverage_days", String(params.coverageDays));
  formData.append("buffer_days", String(params.bufferDays));
  formData.append("lead_time", String(params.leadTime));

  const response = await fetch(
    "http://127.0.0.1:8000/api/download_pdf_report",
    {
      method: "POST",
      body: formData,
    },
  );

  if (!response.ok) {
    const errorDetails = await response.json();

    console.error("Error de validación de FastAPI:", errorDetails);

    throw new Error(
      `Error ${response.status}: ${JSON.stringify(errorDetails.detail)}`,
    );
  }

  const blob = await response.blob();

  if (blob.type && blob.type !== "application/pdf") {
    throw new Error("El servidor no devolvio un PDF");
  }

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "reporte_inventario.pdf";

  document.body.appendChild(link);
  link.click();
  link.remove();

  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
