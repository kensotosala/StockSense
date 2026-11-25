import { createContext, useContext } from "react";

export type AuthUser = {
  sub: string;
  user_id: number;
  first_name: string;
  last_name: string;
  permissions?: string[];
};

type Credentials = {
  username: string;
  password: string;
};

export type RegistrationDetails = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

type AuthContextValue = {
  token: string;
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (credentials: Credentials) => Promise<void>;
  register: (details: RegistrationDetails) => Promise<void>;
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
