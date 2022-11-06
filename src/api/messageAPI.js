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
  recoverMessage: (params) => {
    const url = "/messages/recover";
    return axiosClient.post(url, params);
  },
  getAllMessageByContentType: (params) => {
    const url = "/messages/content-type";
    return axiosClient.post(url, params);
  },
<<<<<<< HEAD
=======
  recoveryMessagse: (params) => {
    const url = "/messages/recover";
    return axiosClient.post(url, params);
  }
>>>>>>> b79283e75aea406934b7d076c93eacc3ff3bcb60
};

export default messageAPI;
