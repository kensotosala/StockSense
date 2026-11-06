import { useState, type SubmitEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const username = formData.get("email");
    const password = formData.get("password");

    if (typeof username !== "string" || typeof password !== "string") {
      setError("Email and password are required.");
      return;
    }

    setError(null);
    try {
      await login({ username, password });
      navigate("/");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Login failed.");
    }
  };

  return (
    <div className="min-h-screen bg-blue-200">
      <div className="flex min-h-screen items-center justify-center bg-[url('/clouds.png')] bg-cover bg-center px-4 py-8">
        <main className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl sm:p-10">
          <div className="mb-8 text-center">
            <h2 className="mb-3 text-2xl font-bold">Inicia con tu cuenta</h2>

            <p className="text-gray-600">
              Accede a tu cuenta para analizar tus datos y mejorar tus órdenes
              de inventario. 100% Gratis
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block">
              <span className="mb-2 block font-medium">Correo electrónico</span>
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </label>

            <label className="block">
              <span className="mb-2 block font-medium">Contraseña</span>
              <input
                type="password"
                name="password"
                autoComplete="current-password"
                required
                className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </label>

            {error && (
              <p role="alert" className="text-red-500">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full rounded-lg bg-black p-3 text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
            >
              Iniciar sesión
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}
