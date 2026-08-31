import { useEffect, useState } from "react";
import "./App.css";
import DataForm from "./components/data-form/data-form";

const App = () => {
  const [openFormDialog, setOpenFormDialog] = useState(false);

  // Function to open or close the dialog
  const handleToggleDialog = () => {
    setOpenFormDialog((prev) => !prev);
  };

  useEffect(() => {
    console.log("App running");
  }, []);

  return (
    <main className="app">
      <header className="header">
        <h1 className="app-title">StockSense</h1>
        <p className="app-subtitle">Inventory Intelligence Platform</p>
      </header>

      {openFormDialog ? (
        <DataForm />
      ) : (
        <button className="btn-get-started" onClick={handleToggleDialog}>
          Get Started
        </button>
      )}
    </main>
  );
};

export default App;
