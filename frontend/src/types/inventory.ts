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
