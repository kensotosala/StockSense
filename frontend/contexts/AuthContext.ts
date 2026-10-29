import { createContext, useContext } from "react";

export type AuthUser = {
  permissions?: string[];
};

type Credentials = {
  username: string;
  password: string;
};

type AuthContextValue = {
  token: string;
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (credentials: Credentials) => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }
  return context;
};
