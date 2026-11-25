import type {
  InventoryPayload,
  InventoryReportResponse,
} from "../types/inventory";

const formatErrorDetail = (detail: unknown) => {
  if (typeof detail === "string") {
    return detail;
  }

  if (!Array.isArray(detail)) {
    return null;
  }

  const messages = detail.flatMap((item) => {
    if (
      typeof item !== "object" ||
      item === null ||
      !("msg" in item) ||
      typeof item.msg !== "string"
    ) {
      return [];
    }

    const location =
      "loc" in item && Array.isArray(item.loc)
        ? `${item.loc.map(String).join(".")}: `
        : "";
    return [`${location}${item.msg}`];
  });

  return messages.length > 0 ? messages.join("; ") : null;
};

export const submitInventoryData = async (
  data: InventoryPayload,
  token: string,
): Promise<InventoryReportResponse> => {
  const formData = new FormData();
  formData.append("sells", data.sells);
  formData.append("actual_inventory", data.actualInventory);

  formData.append("inventory_history_days", data.inventoryHistoryDays);
  formData.append("coverage_days", data.coverageDays);
  if (data.bufferDays) formData.append("buffer_days", data.bufferDays);
  if (data.leadTime) formData.append("lead_time", data.leadTime);

  const response = await fetch("http://127.0.0.1:8000/api/analysis/", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const result = (await response.json()) as { detail?: unknown };
    const detail = formatErrorDetail(result.detail);
    throw new Error(
      detail
        ? `No se pudo analizar el inventario: ${detail}`
        : `Error en el servidor (${response.status}): ${response.statusText}`,
    );
  }

  return (await response.json()) as InventoryReportResponse;
};
