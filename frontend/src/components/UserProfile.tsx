import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import DropdownMenu from "./DropdownMenu";

const UserProfile = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const initials = user
    ? `${user.first_name[0] ?? ""}${user.last_name[0] ?? ""}`.toUpperCase()
    : "?";

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex justify-end">
      <div className="relative">
        <button
          type="button"
          className="flex size-12 items-center justify-center rounded-full bg-blue-950 font-bold text-white transition hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300"
          aria-label="Abrir menú de usuario"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
        >
          {initials}
        </button>
        {isMenuOpen && (
          <DropdownMenu onLogout={handleLogout} user={user} />
        )}
      </div>
    </div>
  );
};

export default UserProfile;
