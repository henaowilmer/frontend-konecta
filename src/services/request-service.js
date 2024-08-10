import HttpService from "./htttp.service";

class RequestService {

  get = async(ctx) => {
    const getRequest = 'requests'+ctx;
    return await HttpService.get(getRequest);
  }

  getId = async(id) => {
    const getRequest = 'requests/'+id;
    return await HttpService.get(getRequest);
  }

  create = async(payload) => {
    const createRequest = 'requests';
    return await HttpService.post(createRequest, payload);
  }

  update = async(payload, id) => {
    const updateRequest = 'requests/'+id;
    return await HttpService.put(updateRequest, payload);
  }

  delete = async(id) => {
    const getRequest = 'requests/'+id;
    return await HttpService.delete(getRequest);
  }

}

export default new RequestService();
