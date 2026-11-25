import { useState, type ReactNode } from "react";
import {
  AuthContext,
  type AuthUser,
  type RegistrationDetails,
} from "./AuthContext";

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

const decodeUser = (token: string): AuthUser => {
  const payload = token.split(".")[1];
  if (!payload) {
    throw new Error("The access token does not have a valid payload.");
  }

  const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
  const paddedBase64 = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
  const binaryPayload = atob(paddedBase64);
  const bytes = Uint8Array.from(binaryPayload, (character) =>
    character.charCodeAt(0),
  );
  const claims: unknown = JSON.parse(new TextDecoder().decode(bytes));

  if (
    typeof claims !== "object" ||
    claims === null ||
    !("sub" in claims) ||
    typeof claims.sub !== "string" ||
    !("user_id" in claims) ||
    typeof claims.user_id !== "number" ||
    !("first_name" in claims) ||
    typeof claims.first_name !== "string" ||
    !("last_name" in claims) ||
    typeof claims.last_name !== "string"
  ) {
    throw new Error("The access token does not contain valid user details.");
  }

  return {
    sub: claims.sub,
    user_id: claims.user_id,
    first_name: claims.first_name,
    last_name: claims.last_name,
    permissions:
      "permissions" in claims &&
      Array.isArray(claims.permissions) &&
      claims.permissions.every(
        (permission): permission is string => typeof permission === "string",
      )
        ? claims.permissions
        : undefined,
  };
};

const readStoredAuth = () => {
  const storedToken = localStorage.getItem(TOKEN_KEY) ?? "";
  if (!storedToken) {
    return { token: "", user: null };
  }

  try {
    return { token: storedToken, user: decodeUser(storedToken) };
  } catch (error) {
    console.error("Could not read the saved authentication token.", error);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    return { token: "", user: null };
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState(readStoredAuth);

  const register = async ({
    firstName,
    lastName,
    email,
    password,
  }: RegistrationDetails) => {
    const normalizedEmail = email.trim().toLowerCase();
    const response = await fetch("http://127.0.0.1:8000/api/users/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_name: normalizedEmail,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: normalizedEmail,
        password,
      }),
    });

    if (!response.ok) {
      if (response.status === 409) {
        throw new Error("Ya existe una cuenta con ese correo electrónico.");
      }

      const result = (await response.json()) as { detail?: unknown };
      throw new Error(
        typeof result.detail === "string"
          ? result.detail
          : `No se pudo crear la cuenta (${response.status}).`,
      );
    }
  };

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

    const user = decodeUser(result.access_token);
    setAuth({ token: result.access_token, user });
    localStorage.setItem(TOKEN_KEY, result.access_token);
    localStorage.removeItem(USER_KEY);
  };

  const logout = () => {
    setAuth({ token: "", user: null });
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        ...auth,
        isAuthenticated: Boolean(auth.token),
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
