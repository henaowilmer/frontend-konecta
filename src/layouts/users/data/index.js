
import MDTypography from "components/MDTypography";
import UserService from "services/user-service";

function formatCurrency(value) {
  const formatter = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 2,
  });
  return formatter.format(value);
}

export default async function data({search, page, limit, startDate, endDate}) {
  let ctx = `?page=${page}&limit=${limit}`
  if(search)ctx += `&search=${search}`
  if(startDate)ctx += `&start_date=${startDate}`
  if(endDate)ctx += `&end_date=${endDate}`
  try {
    const response = await UserService.get(ctx);
    const users = response.data;

    const rows = users.map((user) => ({
      userId: user.id,
      id: (
        <MDTypography component="a" href="#" variant="button" color="text" fontWeight="medium">
          {user.id}
        </MDTypography>
      ),
      name: (
        <MDTypography component="a" href="#" variant="button" color="text" fontWeight="medium">
          {user.name}
        </MDTypography>
      ),
      email: (
        <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
          {user.email}
        </MDTypography>
      ),
      role: (
        <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
          {user.role==='admin'?'Admin':'Empleado'}
        </MDTypography>
      ),
    }));

    return {
      columns: [
        { Header: "id", accessor: "id", align: "left" },
        { Header: "nombre", accessor: "name", align: "left" },
        { Header: "correo", accessor: "email", align: "center" },
        { Header: "rol", accessor: "role", align: "center" }
      ],
      rows: rows,
      totalRecords: response.totalRecords,
      totalPages: response.totalPages
    };
  } catch (res) {
    if (res.hasOwnProperty("message")) {
      console.log(res.message);
    } else {
      console.log(res.errors[0].detail);
    }
  }

  return {
    columns: [
      { Header: "id", accessor: "id", align: "left" },
      { Header: "nombre", accessor: "name", align: "left" },
      { Header: "correo", accessor: "email", align: "center" },
      { Header: "rol", accessor: "role", align: "center" }
    ],
    rows: [],
    totalRecords: 0,
    totalPages: 0
  };
}
