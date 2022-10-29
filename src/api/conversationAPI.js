import axiosClient from "./axiosClient";

const ConversationAPI = {
  getConversationsById: (params) => {
    const url = "/conversation";
    return axiosClient.post(url, params);
  },
  createConversation: (params) => {
    const url = "/conversation/create";
    return axiosClient.post(url, params);
  },
  createGroupConversation: (params) => {
    const url = "/conversation/create-group";
    return axiosClient.post(url, params);
  },
};

export default ConversationAPI;
