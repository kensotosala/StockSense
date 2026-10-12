export async function DownloadPDFReport(reportId: string): Promise<void> {
  const response = await fetch(
    `http://127.0.0.1:8000/api/download_pdf_report/${encodeURIComponent(reportId)}`,
  );

  if (!response.ok) {
    let message = "No se pudo generar el PDF.";

    try {
      const error = await response.json();
      message = error.detail ?? message;
    } catch {
      // Se conserva el mensaje predeterminado.
    }

    throw new Error(message);
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "inventory_report.pdf";
  document.body.appendChild(link);
  link.click();
  link.remove();

  // Liberar el recurso después de iniciar la descarga.
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
