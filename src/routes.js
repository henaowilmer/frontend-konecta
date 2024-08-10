import Dashboard from "layouts/dashboard";
import Employees from "layouts/employees";
import Users from "layouts/users";
import Requests from "layouts/requests";

import Icon from "@mui/material/Icon";

let routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
  },
  {
    type: "collapse",
    name: "Solicitudes",
    key: "solicitudes",
    icon: <Icon fontSize="small">checklist</Icon>,
    route: "/solicitudes",
    component: <Requests />,
  },
  {
    type: "collapse",
    name: "Empleados",
    key: "empleados",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/empleados",
    component: <Employees />,
  },
  {
    type: "collapse",
    name: "Usuarios",
    key: "usuarios",
    icon: <Icon fontSize="small">group</Icon>,
    route: "/usuarios",
    component: <Users />,
  },
];

export default routes;
