import axiosClient from "./axiosClient";

const messageAPI = {
  getAllMessage: (params) => {
    const url = "/messages";
    return axiosClient.post(url, params);
  },
  sendMessage: (params) => {
    const url = "/messages/send";
    return axiosClient.post(url, params);
  },
};

export default messageAPI;
