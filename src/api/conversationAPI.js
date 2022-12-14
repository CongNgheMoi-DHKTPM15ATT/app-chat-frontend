import axiosClient from "./axiosClient";

const ConversationAPI = {
  getConversationsById: (params) => {
    const url = "/conversation";
    return axiosClient.post(url, params);
  },
  getInfoConversationById: (params) => {
    const url = "/conversation/id";
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
  getGroupConversationsById: (params) => {
    const url = "/conversation/group";
    return axiosClient.post(url, params);
  },
  addMemberGroup: (params) => {
    const url = "/group/add-mems";
    return axiosClient.post(url, params);
  },
  outMemberGroup: (params) => {
    const url = "/group/remove-mem";
    return axiosClient.post(url, params);
  },
};

export default ConversationAPI;
