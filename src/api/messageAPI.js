import axiosClient from "./axiosClient";

const messageAPI = {
  getAllMessage: (params) => {
    const url = "/messages";
    return axiosClient.post(url, params);
  },
};

export default messageAPI;
