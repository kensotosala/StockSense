import type { AuthUser } from "../../contexts/AuthContext";

type DropdownMenuProps = {
  onLogout: () => void;
  user: AuthUser | null;
};

const DropdownMenu = ({ onLogout, user }: DropdownMenuProps) => {
  return (
    <div className="absolute right-0 top-full z-50 mt-3 flex w-56 flex-col gap-3 rounded-2xl bg-white p-5 shadow-lg">
      <p className="font-bold text-slate-900">
        {user ? `${user.first_name} ${user.last_name}` : "Usuario"}
      </p>
      <button
        type="button"
        onClick={onLogout}
        className="cursor-pointer text-left font-medium text-red-600"
      >
        Cerrar sesión
      </button>
    </div>
  );
};

export default DropdownMenu;
