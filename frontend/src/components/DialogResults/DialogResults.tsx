import { useEffect } from "react";
import "./DialogResults.css";
import type { InventoryReportItem } from "../../types/inventory";

interface DialogResultsProps {
  handleOpenCloseDialog: () => void;
  data: InventoryReportItem[];
}

const DialogResults = ({ handleOpenCloseDialog, data }: DialogResultsProps) => {
  useEffect(() => {
    console.log("Datos recibidos del backend:", data);
  }, [data]);

  return (
    <div className="form-container">
      <div className="wrapper-btn-close">
        <button onClick={handleOpenCloseDialog} className="btn-close">
          X
        </button>
      </div>

      <h2>Resultados del Análisis</h2>

      <div style={{ overflowX: "auto", marginTop: "1rem" }}>
        <table
          border={1}
          style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "left",
          }}
        >
          <thead>
            <tr>
              <th>Código</th>
              <th>Descripción</th>
              <th>Existencia</th>
              <th>Demanda Mensual</th>
              <th>Punto Reorden</th>
              <th>Cant. A Ordenar</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((item, index) => (
              <tr key={item.CODIGO || index}>
                <td>{item.CODIGO}</td>
                <td>{item.DESCRIPCION}</td>
                <td>{item.EXISTENCIA}</td>
                <td>{item["DEMANDA MENSUAL"]}</td>
                <td>{item["PUNTO DE REORDEN"]}</td>
                <td>
                  <strong>{item["CANTIDAD A ORDENAR"]}</strong>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DialogResults;
