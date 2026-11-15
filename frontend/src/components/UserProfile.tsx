import { useAuth } from "../../contexts/AuthContext";

const UserProfile = () => {
  const { logout } = useAuth();
  return (
    <div className="w-7xl flex justify-end">
      <div className="size-16 rounded-full bg-black flex items-center justify-center text-white font-bold ">
        KN
      </div>
      <ul>
        <button onClick={() => logout()}>Log out</button>
      </ul>
    </div>
  );
};

export default UserProfile;
