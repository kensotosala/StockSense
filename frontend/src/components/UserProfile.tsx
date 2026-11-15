import { useAuth } from "../../contexts/AuthContext";

const UserProfile = () => {
  const { logout, user } = useAuth();
  const initials = user
    ? `${user.first_name[0] ?? ""}${user.last_name[0] ?? ""}`.toUpperCase()
    : "?";

  return (
    <div className="w-7xl flex justify-end">
      <div
        className="size-16 rounded-full bg-black flex items-center justify-center text-white font-bold"
        aria-label={user ? `${user.first_name} ${user.last_name}` : "Usuario"}
        title={user ? `${user.first_name} ${user.last_name}` : undefined}
      >
        {initials}
      </div>
      <ul>
        <button onClick={() => logout()}>Log out</button>
      </ul>
    </div>
  );
};

export default UserProfile;
