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
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          <p>email</p>
          <input name="email" type="text" required />
        </label>
        <label>
          <p>Password</p>
          <input type="password" name="password" required />
        </label>
        <br />
        {error && <p role="alert">{error}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
