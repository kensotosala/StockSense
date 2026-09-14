export interface InventoryPayload {
  sells: File;
  actualInventory: File;
  inventoryHistoryDays: string;
  coverageDays: string;
  bufferDays: string;
  leadTime: string;
}

// Send inventory and sales data to the server
export const submitInventoryData = async (
  data: InventoryPayload,
): Promise<boolean> => {
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

    return true;
  } catch (error) {
    console.error("Error al enviar inventoryData:", error);
    throw error;
  }
};
