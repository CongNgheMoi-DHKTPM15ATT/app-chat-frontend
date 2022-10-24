import axios from "axios";
import queryString from "query-string";

const s3_axiosClient = axios.create({
  baseURL: process.env.REACT_APP_S3_URL,
  headers: {
    "Content-Type": "application/json",
  },
  paramsSerializer: (params) => queryString.stringify(params),
});

// axiosClient.interceptors.request.use(async (config) => {
//     // Handle token here ...
//     return config;
// })

s3_axiosClient.interceptors.response.use(
  async (response) => {
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  (error) => {
    throw error;
  }
);

export default s3_axiosClient;
