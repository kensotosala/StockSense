import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import "./App.css";

interface FormState {
  sellsData: File | null;
  inventoryData: File | null;
}

interface FormErrors {
  sellsData?: string;
  inventoryData?: string;
}

const App = () => {
  const [formData, setFormData] = useState<FormState>({
    sellsData: null,
    inventoryData: null,
  });

  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    console.log("App montada");
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name as keyof FormState;
    const file = e.target.files?.[0] ?? null;

    console.log("handleChange:", name, file);

    setFormData((prevData) => ({
      ...prevData,
      [name]: file,
    }));

    const errorKey = name as keyof FormErrors;

    if (errors[errorKey]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [errorKey]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.sellsData) {
      newErrors.sellsData = "El archivo de datos de ventas es obligatorio.";
    }

    if (!formData.inventoryData) {
      newErrors.inventoryData = "El archivo de inventario es obligatorio.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    console.log("GENERAR PRESIONADO");
    console.log("Ventas:", formData.sellsData);
    console.log("Inventario:", formData.inventoryData);
    console.log("Datos del formulario:", formData);

    if (!validateForm()) {
      console.log("Formulario inválido");
      return;
    }

    const { sellsData, inventoryData } = formData;
    if (!sellsData || !inventoryData) {
      console.log("Error: archivos no seleccionados después de validación.");
      return;
    }

    const data = new FormData();

    data.append("sellsData", sellsData);
    data.append("inventoryData", inventoryData);

    console.log("Formulario válido:", formData);
    console.log("FormData creado:", data);
  };

  return (
    <main className="app">
      <header className="header">
        <h1 className="app-title">StockSense</h1>

        <p className="app-subtitle">Manage Your Inventory and Sales Data</p>
      </header>

      <form onSubmit={handleSubmit} className="form-container">
        <div className="sells-data">
          <label htmlFor="sells" className="upload-sells-data">
            Upload Sells Data
          </label>

          <input
            id="sells"
            type="file"
            name="sellsData"
            className="input-sells"
            accept=".csv,.xlsx,.xls"
            onChange={handleChange}
          />

          {formData.sellsData && (
            <span className="file-name">{formData.sellsData.name}</span>
          )}

          {errors.sellsData && (
            <span className="error-message">{errors.sellsData}</span>
          )}
        </div>

        <div className="inventory-data">
          <label htmlFor="inventory" className="upload-inventory-data">
            Upload Inventory Data
          </label>

          <input
            id="inventory"
            type="file"
            name="inventoryData"
            className="input-inventory"
            accept=".csv,.xlsx,.xls"
            onChange={handleChange}
          />

          {formData.inventoryData && (
            <span className="file-name">{formData.inventoryData.name}</span>
          )}

          {errors.inventoryData && (
            <span className="error-message">{errors.inventoryData}</span>
          )}
        </div>

        <div className="submit-button-wrapper">
          <button type="submit" className="submit-button">
            Generar
          </button>
        </div>
      </form>
    </main>
  );
};

export default App;
