const FetchClient = {
  get: async (url) => {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  },

  post: async (url, data) => {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    return result;
  },

  put: async (url, data) => {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    return result;
  },
};

export default FetchClient