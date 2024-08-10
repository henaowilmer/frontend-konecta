
import EmployeeService from "services/employee-service";

export default async function data() {

  try {
    const response = await EmployeeService.options();
    const employees = response.data;

    return {
      employees: employees
    };
  } catch (res) {
    if (res.hasOwnProperty("message")) {
      console.log(res.message);
    } else {
      console.log(res.errors[0].detail);
    }
  }

  return {
    employees: []
  };
}
