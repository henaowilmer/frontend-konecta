import HttpService from "./htttp.service";

class EmployeeService {

  options = async() => {
    const optionsEmployee = 'employees/options';
    return await HttpService.get(optionsEmployee);
  }

  get = async(ctx) => {
    const getEmployee = 'employees'+ctx;
    return await HttpService.get(getEmployee);
  }

  getId = async(id) => {
    const getEmployee = 'employees/'+id;
    return await HttpService.get(getEmployee);
  }

  create = async(payload) => {
    const createEmployee = 'employees';
    return await HttpService.post(createEmployee, payload);
  }

  update = async(payload, id) => {
    const updateEmployee = 'employees/'+id;
    return await HttpService.put(updateEmployee, payload);
  }

  delete = async(id) => {
    const getEmployee = 'employees/'+id;
    return await HttpService.delete(getEmployee);
  }

}

export default new EmployeeService();
