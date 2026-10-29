import type { ReactNode } from "react";
import Fallback from "../components/Fallback";
import { useAuth } from "../../contexts/AuthContext";

type IsAuthenticatedProps = {
  children: ReactNode;
  fallback?: ReactNode;
};

const IsAuthenticated = ({
  fallback = <Fallback />,
  children,
}: IsAuthenticatedProps) => {
  const { isAuthenticated } = useAuth();
  return <>{isAuthenticated ? children : fallback}</>;
};

export default IsAuthenticated;
