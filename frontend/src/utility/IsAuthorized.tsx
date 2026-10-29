import type { ReactNode } from "react";
import Fallback from "../components/Fallback";
import { useAuth } from "../../contexts/AuthContext";

type IsAuthorizedProps = {
  permissions: string[];
  children: ReactNode;
  fallback?: ReactNode;
};

const IsAuthorized = ({
  permissions,
  fallback = <Fallback />,
  children,
}: IsAuthorizedProps) => {
  const { user } = useAuth();
  const isAuthorized =
    user?.permissions?.some((permission) => permissions.includes(permission)) ??
    false;

  return <>{isAuthorized ? children : fallback}</>;
};

export default IsAuthorized;
