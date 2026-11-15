import { useEffect, useState } from "react";
import DataForm from "../components/data-form/InventoryDataForm";
import UserProfile from "../components/UserProfile";

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
    <div className="min-h-screen bg-blue-200">
      <div className="flex flex-col min-h-screen items-center justify-center bg-[url('/clouds.png')] bg-cover bg-center px-4 py-8">
        <UserProfile />
        <header className="header">
          <h1 className="app-title">StockSense</h1>
          <p className="app-subtitle">Inventory Intelligence Platform</p>
        </header>
        <main className="">
          {isLoading ? (
            <div className="spinner"></div>
          ) : openFormDialog ? (
            <DataForm handleToggleDialog={handleToggleDialog} />
          ) : (
            <button
              className="bg-black  text-white p-5 rounded-md hover:bg-blue-700"
              onClick={handleToggleDialog}
            >
              Get Started
            </button>
          )}
        </main>
      </div>
    </div>
  );
};

export default StartAnalysis;
