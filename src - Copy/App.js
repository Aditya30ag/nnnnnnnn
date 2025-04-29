import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import WelcomePage from "./components/WelcomePage";
import Login from "./components/Login";
import Signup from "./components/SignUp";
import Explore from "./components/Explore";
import Dashborad from "./components/Dashborad";
import Account from "./components/Account";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <>
          <WelcomePage />
        </>
      ),
    },
    {
      path: "/explore",
      element: (
        <>
          <Explore/>
        </>
      ),
    },
    {
      path: "/dashboard",
      element: (
        <>
          <Dashborad/>
        </>
      ),
    },
    {
      path: "/login",
      element: (
        <>
          <Login/>
        </>
      ),
    },
    {
      path: "/signup",
      element: (
        <>
          <Signup/>
        </>
      ),
    },
    {
      path: "/account",
      element: (
        <>
          <Account/>
        </>
      ),
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
