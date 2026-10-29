import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthProvider";
import "./App.css";
import router from "./router";

const App = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;
