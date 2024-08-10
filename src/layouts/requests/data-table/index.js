
import MDTypography from "components/MDTypography";
import RequestService from "services/request-service";

export default async function data({search, employeeId, page, limit, startDate, endDate}) {
  let ctx = `?page=${page}&limit=${limit}`
  if(search)ctx += `&search=${search}`
  if(employeeId)ctx += `&employee_id=${employeeId}`
  if(startDate)ctx += `&start_date=${startDate}`
  if(endDate)ctx += `&end_date=${endDate}`
  try {
    const response = await RequestService.get(ctx);
    const requests = response.data;

    const rows = requests.map((request) => ({
      requestId: request.id,
      id: (
        <MDTypography component="a" href="#" variant="button" color="text" fontWeight="medium">
          {request.id}
        </MDTypography>
      ),
      code: (
        <MDTypography component="a" href="#" variant="button" color="text" fontWeight="medium">
          {request.code}
        </MDTypography>
      ),
      description: (
        <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
          {request.description}
        </MDTypography>
      ),
      createdAt: (
        <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
          {request.createdAt.replace('T',' ').slice(0,10).split('-').reverse().join('-')}
        </MDTypography>
      ),
      employee_id: (
        <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
          {request.employee_id}
        </MDTypography>
      ),
    }));

    return {
      columns: [
        { Header: "id", accessor: "id", align: "left" },
        { Header: "código", accessor: "code", align: "left" },
        { Header: "descripción", accessor: "description", align: "center" },
        { Header: "fecha", accessor: "createdAt", align: "center" },
        { Header: "empleado", accessor: "employee_id", align: "center" },
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
      { Header: "código", accessor: "code", align: "left" },
      { Header: "descripción", accessor: "description", align: "center" },
      { Header: "resumen", accessor: "resumen", align: "center" },
      { Header: "employee_id", accessor: "Empleado", align: "center" },
    ],
    rows: [],
    totalRecords: 0,
    totalPages: 0
  };
}
