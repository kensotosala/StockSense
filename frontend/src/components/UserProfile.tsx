import { useAuth } from "../../contexts/AuthContext";
import DropdownMenu from "./DropdownMenu";

const UserProfile = () => {
  const { logout, user } = useAuth();
  const initials = user
    ? `${user.first_name[0] ?? ""}${user.last_name[0] ?? ""}`.toUpperCase()
    : "?";

  return (
    <div className="w-7xl flex justify-end">
      {/* 1. Nuevo contenedor RELATIVE solo para el avatar y su menú */}
      <div className="relative">
        <div
          className="size-16 rounded-full bg-black flex items-center justify-center text-white font-bold cursor-pointer"
          aria-label={user ? `${user.first_name} ${user.last_name}` : "Usuario"}
          title={user ? `${user.first_name} ${user.last_name}` : undefined}
        >
          {initials}
        </div>

        {/* 2. El menú ahora toma como referencia el div "relative" de arriba */}
        <DropdownMenu onLogout={logout} user={user} />
      </div>
    </div>
  );
};

export default UserProfile;
