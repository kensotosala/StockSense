import { useState, type ReactNode } from "react";
import { AuthContext, type AuthUser } from "./AuthContext";

const TOKEN_KEY = "token";
const USER_KEY = "user";

type Credentials = {
  username: string;
  password: string;
};

type LoginResponse = {
  access_token: string;
  token_type: string;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState(
    () => localStorage.getItem(TOKEN_KEY) ?? "",
  );

  const login = async ({ username, password }: Credentials) => {
    const response = await fetch("http://127.0.0.1:8000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ username, password }),
    });

    if (!response.ok) {
      const result = (await response.json()) as { detail?: string };
      throw new Error(result.detail ?? `Login failed (${response.status}).`);
    }

    const result = (await response.json()) as LoginResponse;
    if (!result.access_token) {
      throw new Error("The login response did not include an access token.");
    }

    setToken(result.access_token);
    setUser(null);
    localStorage.setItem(TOKEN_KEY, result.access_token);
    localStorage.removeItem(USER_KEY);
  };

  const logout = () => {
    setToken("");
    setUser(null);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
  };

  return (
    <AuthContext.Provider
      value={{ token, user, isAuthenticated: Boolean(token), login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
