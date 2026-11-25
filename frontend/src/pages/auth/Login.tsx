import { useState, type SubmitEvent } from "react";
import {
  Link,
  Navigate,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";

export default function Login() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const accountCreated = searchParams.get("registered") === "1";

  if (isAuthenticated) {
    return <Navigate to="/start-analysis" replace />;
  }

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const username = formData.get("email");
    const password = formData.get("password");

    if (typeof username !== "string" || typeof password !== "string") {
      setError("El correo electrónico y la contraseña son obligatorios.");
      return;
    }

    setError(null);
    setIsSubmitting(true);
    try {
      await login({ username, password });
      navigate("/start-analysis", { replace: true });
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "No se pudo iniciar sesión. Inténtalo de nuevo.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8">
      <main className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl sm:p-10">
        <Link
          to="/"
          className="text-sm font-semibold text-blue-800 hover:text-blue-600"
        >
          ← Volver al inicio
        </Link>
        <div className="mb-8 mt-8 text-center">
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.16em] text-blue-700">
            StockSense
          </p>
          <h1 className="mb-3 text-2xl font-bold">Inicia sesión</h1>

          <p className="text-gray-600">
            Accede para analizar tus datos y obtener recomendaciones para tu
            inventario.
          </p>
        </div>

        {accountCreated && (
          <p
            role="status"
            className="mb-5 rounded-lg bg-green-50 p-3 text-sm text-green-800"
          >
            Tu cuenta se creó correctamente. Ya puedes iniciar sesión con tu
            correo.
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block">
            <span className="mb-2 block font-medium">Correo electrónico</span>
            <input
              name="email"
              type="email"
              autoComplete="email"
              required
              disabled={isSubmitting}
              className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100"
            />
          </label>

          <label className="block">
            <span className="mb-2 block font-medium">Contraseña</span>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="current-password"
                required
                disabled={isSubmitting}
                className="w-full rounded-lg border border-gray-300 p-3 pr-20 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100"
              />
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                className="absolute inset-y-0 right-3 text-sm font-semibold text-blue-800"
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? "Ocultar" : "Mostrar"}
              </button>
            </div>
          </label>

          {error && (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
            className="w-full rounded-lg bg-blue-950 p-3 font-semibold text-white transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:cursor-wait disabled:opacity-70"
          >
            {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          ¿No tienes cuenta?{" "}
          <Link
            to="/register"
            className="font-semibold text-blue-800 hover:text-blue-600"
          >
            Regístrate
          </Link>
        </p>
      </main>
    </div>
  );
}
