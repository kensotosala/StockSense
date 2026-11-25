import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export const Index = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link to="/" className="text-xl font-black tracking-tight text-blue-950">
          StockSense
        </Link>
        {isAuthenticated ? (
          <div className="flex items-center gap-4 text-sm">
            <span className="hidden text-slate-600 sm:inline">
              Hola, {user?.first_name}
            </span>
            <button
              type="button"
              onClick={logout}
              className="rounded-lg border border-slate-300 px-4 py-2 font-semibold transition hover:bg-white"
            >
              Cerrar sesión
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold transition hover:bg-white"
          >
            Iniciar sesión
          </Link>
        )}
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-16 pt-12 sm:pt-20">
        <section className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="mb-5 text-sm font-bold uppercase tracking-[0.18em] text-blue-700">
              Inteligencia para tu inventario
            </p>
            <h1 className="max-w-2xl text-4xl font-black leading-tight tracking-tight text-blue-950 sm:text-6xl">
              Decide qué reponer con más claridad.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              Analiza tus ventas y existencias para obtener recomendaciones de
              reabastecimiento en un solo lugar.
            </p>
            <div className="mt-8 flex flex-col items-start gap-4">
              <Link
                to={isAuthenticated ? "/start-analysis" : "/login"}
                className="inline-flex items-center justify-center rounded-xl bg-blue-950 px-6 py-4 font-bold text-white shadow-lg shadow-blue-950/15 transition hover:-translate-y-0.5 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300"
              >
                {isAuthenticated
                  ? "Comenzar un análisis"
                  : "Iniciar sesión para comenzar"}
              </Link>
              {!isAuthenticated && (
                <p className="text-sm text-slate-600">
                  ¿Aún no tienes cuenta?{" "}
                  <Link
                    to="/register"
                    className="font-bold text-blue-800 hover:text-blue-600"
                  >
                    Regístrate gratis
                  </Link>
                </p>
              )}
            </div>
          </div>

          <div className="rounded-3xl bg-white p-7 shadow-xl shadow-slate-200/70 sm:p-9">
            <h2 className="text-xl font-bold text-blue-950">Así funciona</h2>
            <ol className="mt-7 space-y-6">
              {[
                ["01", "Carga tus archivos", "Agrega tus datos de ventas e inventario en CSV."],
                ["02", "Configura el análisis", "Indica tus días de cobertura y tiempos de entrega."],
                ["03", "Revisa tus recomendaciones", "Consulta los productos que requieren reposición."],
              ].map(([number, title, description]) => (
                <li key={number} className="flex gap-4">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-800">
                    {number}
                  </span>
                  <div>
                    <h3 className="font-bold">{title}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
        <Outlet />
      </main>
    </div>
  );
};
