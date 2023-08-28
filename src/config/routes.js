import Home from "../screens/Home";
import Login from "../screens/admin/Login";
import Dashboard from "../screens/admin/Dashboard"

const routes = [
  {
    path: "",
    component: Home,
    name: "Home Page",
    protected: false,
  },
  {
    path: "/admin",
    component: Login,
    name: "Login Screen",
    protected: false,
  },
  {
    path: "/admin/dashboard",
    component: Dashboard,
    name: "Admin Dashboard screen",
    protected: true,
  },
];

export default routes;
