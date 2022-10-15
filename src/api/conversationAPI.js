import axiosClient from "./axiosClient";

const ConversationAPI = {
  getConversationsById: (params) => {
    const url = "/conversation";
    return axiosClient.post(url, params);
  },
};

export default ConversationAPI;
