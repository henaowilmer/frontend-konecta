
import MDTypography from "components/MDTypography";
import EmployeeService from "services/employee-service";

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
    const response = await EmployeeService.get(ctx);
    const employees = response.data;

    const rows = employees.map((employee) => ({
      employeeId: employee.id,
      id: (
        <MDTypography component="a" href="#" variant="button" color="text" fontWeight="medium">
          {employee.id}
        </MDTypography>
      ),
      name: (
        <MDTypography component="a" href="#" variant="button" color="text" fontWeight="medium">
          {employee.name}
        </MDTypography>
      ),
      date_admission: (
        <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
          {employee.date_admission.split('T')[0].split('-').reverse().join('-')}
        </MDTypography>
      ),
      salary: (
        <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
          {formatCurrency(employee.salary)}
        </MDTypography>
      ),
    }));

    return {
      columns: [
        { Header: "id", accessor: "id", align: "left" },
        { Header: "nombre", accessor: "name", align: "left" },
        { Header: "fecha admisión", accessor: "date_admission", align: "center" },
        { Header: "salario", accessor: "salary", align: "center" }
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
      { Header: "fecha admisión", accessor: "date_admission", align: "center" },
      { Header: "salario", accessor: "salary", align: "center" }
    ],
    rows: [],
    totalRecords: 0,
    totalPages: 0
  };
}
