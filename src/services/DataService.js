import FetchClient from "../utilities/FetchClient";
class DataService {
  constructor(url) {
    this.fetchClient = FetchClient;
    this.baseURL = import.meta.env.VITE_APP_BASE_URL;
    this.URL = url;
  }

  async get() {
    const response = await this.fetchClient.get(`${this.URL}`);
    return response;
  }

  async post(data) {
    const response = await this.fetchClient.post(`${this.URL}`, data);
    return response;
  }

  async find(data) {
    const response = await this.fetchClient.post(`${this.URL}`, data);
    return response;
  }

  async getAccounts() {
    const response = await this.fetchClient.get(`${this.baseURL}/api/account`);
    return response;
  }

  /*end of class */
}

export default DataService;
