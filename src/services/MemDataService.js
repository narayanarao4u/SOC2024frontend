import FetchClient from "../utilities/FetchClient";
class MemDataService {
  constructor() {
    this.fetchClient = FetchClient;
    this.baseURL = import.meta.env.VITE_APP_BASE_URL;
  }

  async get() {
    const response = await this.fetchClient.get(`${this.baseURL}/api/memdata`);
    return response;
  }

  async post(data) {
    const response = await this.fetchClient.post(`${this.baseURL}/api/memdata`, data);
    return response;
  }

  async find(data) {
    const response = await this.fetchClient.post(`${this.baseURL}/api/memdata`, data);
    return response;
  }

  async getStockBalance() {
    const response = await this.fetchClient.get(`${this.baseURL}/api/stockBalance`);
    return response;
  }

  /*end of class */
}

export default MemDataService;
