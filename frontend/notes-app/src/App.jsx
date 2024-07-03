import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home/Home";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";

const routes = createBrowserRouter([
  { path: "/dashboard", element: <Home /> },
  { path: "/", element: <Login /> },
  { path: "/signup", element: <Signup /> },
]);

function App() {
  return <RouterProvider router={routes} />;
}

export default App;
