import HttpService from "./htttp.service";

class UserService {

  options = async() => {
    const optionsUser = 'users/options';
    return await HttpService.get(optionsUser);
  }

  get = async(ctx) => {
    const getUser = 'users'+ctx;
    return await HttpService.get(getUser);
  }

  getId = async(id) => {
    const getUser = 'users/'+id;
    return await HttpService.get(getUser);
  }

  create = async(payload) => {
    const createUser = 'users';
    return await HttpService.post(createUser, payload);
  }

  update = async(payload, id) => {
    const updateUser = 'users/'+id;
    return await HttpService.put(updateUser, payload);
  }

  delete = async(id) => {
    const getUser = 'users/'+id;
    return await HttpService.delete(getUser);
  }

}

export default new UserService();
