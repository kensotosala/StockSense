import { useState } from "react";
import { Link } from "react-router-dom";
import DataForm from "../components/data-form/InventoryDataForm";
import UserProfile from "../components/UserProfile";

const StartAnalysis = () => {
  const [openFormDialog, setOpenFormDialog] = useState(false);

  const handleToggleDialog = () => {
    setOpenFormDialog((isOpen) => !isOpen);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link to="/" className="text-xl font-black tracking-tight text-blue-950">
          StockSense
        </Link>
        <UserProfile />
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-16 pt-8">
        {openFormDialog ? (
          <DataForm handleToggleDialog={handleToggleDialog} />
        ) : (
          <section className="mx-auto max-w-3xl rounded-3xl bg-white px-6 py-12 text-center shadow-xl shadow-slate-200/70 sm:px-12 sm:py-16">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-700">
              Tu espacio de análisis
            </p>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-blue-950 sm:text-5xl">
              Prepara tu próxima decisión de compra
            </h1>
            <p className="mx-auto mt-5 max-w-xl leading-7 text-slate-600">
              Sube tus archivos CSV de ventas e inventario actual. Después
              podrás revisar las recomendaciones de reposición.
            </p>

            <div className="mt-9 grid gap-4 text-left sm:grid-cols-3">
              {[
                ["1", "Ventas", "Historial de ventas en CSV"],
                ["2", "Inventario", "Existencias actuales en CSV"],
                ["3", "Parámetros", "Cobertura y tiempos opcionales"],
              ].map(([number, title, description]) => (
                <div key={number} className="rounded-2xl bg-slate-50 p-5">
                  <span className="text-sm font-bold text-blue-700">
                    PASO {number}
                  </span>
                  <h2 className="mt-2 font-bold text-slate-900">{title}</h2>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {description}
                  </p>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleToggleDialog}
              className="mt-9 rounded-xl bg-blue-950 px-7 py-4 font-bold text-white transition hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300"
            >
              Cargar archivos y continuar
            </button>
          </section>
        )}
      </main>
    </div>
  );
};

export default StartAnalysis;
