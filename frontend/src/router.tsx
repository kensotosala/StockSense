import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import { Index } from "./pages";
import Unauthenticated from "./pages/unauthenticated";
import Authenticated from "./pages/authenticated";
import IsAuthenticated from "./utility/IsAuthenticated";
import IsAuthorized from "./utility/IsAuthorized";
import AuthentictedAndUnauthorized from "./pages/authenticted-and-authorized";
import AuthentictedAndAuthorized from "./pages/authenticted-and-unauthorized";
import StartAnalysis from "./pages/start-analysis";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
    children: [
      {
        path: "/unauthenticated",
        element: <Unauthenticated />,
      },
      {
        path: "/authenticated",
        element: (
          <IsAuthenticated>
            <Authenticated />
          </IsAuthenticated>
        ),
      },
      {
        path: "/authenticated-and-authorized",
        element: (
          <IsAuthenticated>
            <IsAuthorized permissions={["authorized"]}>
              <AuthentictedAndAuthorized />
            </IsAuthorized>
          </IsAuthenticated>
        ),
      },
      {
        path: "/authenticated-and-unauthorized",
        element: (
          <IsAuthenticated>
            <IsAuthorized permissions={["authorized"]}>
              <AuthentictedAndUnauthorized />
            </IsAuthorized>
          </IsAuthenticated>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/start-analysis",
    element: (
      <IsAuthenticated>
        <StartAnalysis />
      </IsAuthenticated>
    ),
  },
  {
    path: "*",
    element: <h1>404 page not found!!</h1>,
  },
]);

export default router;
