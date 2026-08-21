import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import "./App.css";

interface FormState {
  sells: File | null;
  inventory: File | null;
}

interface FormErrors {
  sells?: string;
  inventory?: string;
}

const App = () => {
  const [formData, setFormData] = useState<FormState>({
    sells: null,
    inventory: null,
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

    if (!formData.sells) {
      newErrors.sells = "El archivo de datos de ventas es obligatorio.";
    }

    if (!formData.inventory) {
      newErrors.inventory = "El archivo de inventario es obligatorio.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    console.log("GENERAR PRESIONADO");
    console.log("Ventas:", formData.sells);
    console.log("Inventario:", formData.inventory);
    console.log("Datos del formulario:", formData);

    if (!validateForm()) {
      console.log("Formulario inválido");
      return;
    }

    const { sells, inventory } = formData;
    if (!sells || !inventory) {
      console.log("Error: archivos no seleccionados después de validación.");
      return;
    }

    const data = new FormData();

    data.append("sells", sells);
    data.append("inventory", inventory);

    console.log("Formulario válido:", formData);
    console.log("FormData creado:", data);
  };

  return (
    <main className="app">
      <header className="header">
        <h1 className="app-title">StockSense</h1>

        <p className="app-subtitle">Inventory Intelligence Platform</p>
      </header>

      <form onSubmit={handleSubmit} className="form-container">
        <div className="sells-data">
          <label htmlFor="sells" className="upload-sells-data">
            Upload Sells Data
          </label>

          <input
            id="sells"
            type="file"
            name="sells"
            className="input-sells"
            accept=".csv,.xlsx,.xls"
            onChange={handleChange}
          />

          {formData.sells && (
            <span className="file-name">{formData.sells.name}</span>
          )}

          {errors.sells && (
            <span className="error-message">{errors.sells}</span>
          )}
        </div>

        <div className="inventory-data">
          <label htmlFor="inventory" className="upload-inventory-data">
            Upload Inventory Data
          </label>

          <input
            id="inventory"
            type="file"
            name="inventory"
            className="input-inventory"
            accept=".csv,.xlsx,.xls"
            onChange={handleChange}
          />

          {formData.inventory && (
            <span className="file-name">{formData.inventory.name}</span>
          )}

          {errors.inventory && (
            <span className="error-message">{errors.inventory}</span>
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
