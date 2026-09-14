export interface InventoryPayload {
  salesData: File;
  currentInventory: File;
  inventoryHistoryDays: File;
  coverageDays: string;
  bufferDays: string;
  leadTime: string;
}

// Send inventory and sales data to the server
export const submitInventoryData = async (
  data: InventoryPayload,
): Promise<boolean> => {
  const formData = new FormData();
  formData.append("salesData", data.salesData);
  formData.append("currentInventory", data.currentInventory);
  formData.append("inventoryHistoryDays", data.inventoryHistoryDays);
  formData.append("coverageDays", data.coverageDays);
  formData.append("bufferDays", data.bufferDays);
  formData.append("leadTime", data.leadTime);

  try {
    const response = await fetch("https://tu-api.com", {
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
