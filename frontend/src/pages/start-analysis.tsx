import { useEffect, useState } from "react";
import DataForm from "../components/data-form/InventoryDataForm";

const StartAnalysis = () => {
  const [openFormDialog, setOpenFormDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log("App running");
  }, []);

  // Function to open or close the dialog
  const handleToggleDialog = () => {
    if (!openFormDialog) {
      setIsLoading(true);

      // Simulates the loading time
      setTimeout(() => {
        setIsLoading(false);
        setOpenFormDialog(true);
      }, 500);
    } else {
      setOpenFormDialog(false);
    }
  };

  return (
    <main className="app">
      <header className="header">
        <h1 className="app-title">StockSense</h1>
        <p className="app-subtitle">Inventory Intelligence Platform</p>
      </header>

      {isLoading ? (
        <div className="spinner"></div>
      ) : openFormDialog ? (
        <DataForm handleToggleDialog={handleToggleDialog} />
      ) : (
        <button className="btn-get-started" onClick={handleToggleDialog}>
          Get Started
        </button>
      )}
    </main>
  );
};

export default StartAnalysis;
