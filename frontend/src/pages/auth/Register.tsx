import { useState, type SubmitEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";

export default function Register() {
  const { isAuthenticated, register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/start-analysis" replace />;
  }

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const firstName = formData.get("firstName");
    const lastName = formData.get("lastName");
    const email = formData.get("email");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    if (
      typeof firstName !== "string" ||
      typeof lastName !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      typeof confirmPassword !== "string"
    ) {
      setError("Completa todos los campos para continuar.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setError(null);
    setIsSubmitting(true);
    try {
      await register({ firstName, lastName, email, password });
      navigate("/login?registered=1", { replace: true });
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "No se pudo crear la cuenta. Inténtalo de nuevo.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8">
      <main className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl sm:p-10">
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
          <h1 className="mb-3 text-2xl font-bold">Crea tu cuenta</h1>
          <p className="text-gray-600">
            Regístrate para empezar a analizar y gestionar tu inventario.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block font-medium">Nombre</span>
              <input
                name="firstName"
                type="text"
                autoComplete="given-name"
                required
                maxLength={100}
                disabled={isSubmitting}
                className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100"
              />
            </label>

            <label className="block">
              <span className="mb-2 block font-medium">Apellido</span>
              <input
                name="lastName"
                type="text"
                autoComplete="family-name"
                required
                maxLength={100}
                disabled={isSubmitting}
                className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100"
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-2 block font-medium">Correo electrónico</span>
            <input
              name="email"
              type="email"
              autoComplete="email"
              required
              maxLength={254}
              disabled={isSubmitting}
              className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100"
            />
            <span className="mt-1 block text-sm text-gray-500">
              Usarás este correo para iniciar sesión.
            </span>
          </label>

          <label className="block">
            <span className="mb-2 block font-medium">Contraseña</span>
            <input
              name="password"
              type={showPasswords ? "text" : "password"}
              autoComplete="new-password"
              required
              minLength={8}
              disabled={isSubmitting}
              className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100"
            />
          </label>

          <label className="block">
            <span className="mb-2 block font-medium">Confirmar contraseña</span>
            <div className="relative">
              <input
                name="confirmPassword"
                type={showPasswords ? "text" : "password"}
                autoComplete="new-password"
                required
                minLength={8}
                disabled={isSubmitting}
                className="w-full rounded-lg border border-gray-300 p-3 pr-24 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100"
              />
              <button
                type="button"
                onClick={() => setShowPasswords((visible) => !visible)}
                className="absolute inset-y-0 right-3 text-sm font-semibold text-blue-800"
                aria-label={showPasswords ? "Ocultar contraseñas" : "Mostrar contraseñas"}
              >
                {showPasswords ? "Ocultar" : "Mostrar"}
              </button>
            </div>
            <span className="mt-1 block text-sm text-gray-500">
              Usa al menos 8 caracteres.
            </span>
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
            {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          ¿Ya tienes una cuenta?{" "}
          <Link
            to="/login"
            className="font-semibold text-blue-800 hover:text-blue-600"
          >
            Inicia sesión
          </Link>
        </p>
      </main>
    </div>
  );
}
