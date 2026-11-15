const DropdownMenu = ({ onLogout, user }) => {
  return (
    <div className="absolute top-full right-0 mt-3 w-48 flex flex-col gap-3 bg-fuchsia-50 rounded-2xl p-5 shadow-lg z-50">
      <p className="font-bold">{user.first_name + " " + user.last_name}</p>
      <button
        onClick={onLogout}
        className="text-left text-red-600 font-medium cursor-pointer"
      >
        Log out
      </button>
    </div>
  );
};

export default DropdownMenu;
