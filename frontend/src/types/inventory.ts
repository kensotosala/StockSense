export interface InventoryReportItem {
  CODIGO: string;
  DESCRIPCION: string;
  CANTIDAD: number;
  "DEMANDA MENSUAL": number;
  "DEMANDA DIARIA": number;
  "STOCK SEGURIDAD": number;
  "PUNTO DE REORDEN": number;
  EXISTENCIA: number;
  "CANTIDAD A ORDENAR": number;
}

export interface InventoryReportResponse {
  items: InventoryReportItem[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface InventoryPayload {
  sells: File;
  actualInventory: File;
  inventoryHistoryDays: string;
  coverageDays: string;
  bufferDays: string;
  leadTime: string;
}
