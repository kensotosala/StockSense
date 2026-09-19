export interface InventoryPayload {
  sells: File;
  actualInventory: File;
  inventoryHistoryDays: string;
  coverageDays: string;
  bufferDays: string;
  leadTime: string;
}

export interface ReportItem {
  [key: string]: unknown;
}

export const submitInventoryData = async (
  data: InventoryPayload,
): Promise<ReportItem[]> => {
  const formData = new FormData();
  formData.append("sells", data.sells);
  formData.append("actual_inventory", data.actualInventory);

  if (data.inventoryHistoryDays)
    formData.append("inventory_history_days", data.inventoryHistoryDays);
  if (data.coverageDays) formData.append("coverage_days", data.coverageDays);
  if (data.bufferDays) formData.append("buffer_days", data.bufferDays);
  if (data.leadTime) formData.append("lead_time", data.leadTime);

  try {
    const response = await fetch("http://127.0.0.1:8000/api/analysis", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Error en el servidor: ${response.statusText}`);
    }

    const result: ReportItem[] = await response.json();
    console.log(result);
    return result;
  } catch (error) {
    console.error("Error al enviar inventoryData:", error);
    throw error;
  }
};
