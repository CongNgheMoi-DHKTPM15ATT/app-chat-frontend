import axiosClient from "./axiosClient";

const userAPI = {
  // loginAccount: (params) => {
  //     const url = "/iuhcoder/api/login/login_by_account/";
  //     return axiosCLient.post(url, params);
  // },

  RegisterByUserName: (params) => {
    const url = "/auth/register";
    return axiosClient.post(url, params);
  },
  loginByUserName: (params) => {
    const url = "/auth/login";
    return axiosClient.post(url, params);
  },
  searchUser: (params) => {
    const url = "/user/search";
    return axiosClient.post(url, params);
  },
  getUserbyId: (params) => {
    const url = "/user/id";
    return axiosClient.post(url, params);
  },
  sendFriendRequest: (params) => {
    const url = "/user/send-friend-request";
    return axiosClient.post(url, params);
  },
  getUserPending: (params) => {
    const url = "/user/get-friends-pending";
    return axiosClient.post(url, params);
  },
  sendConfirmRequest: (params) => {
    const url = "/user/confirm-friend-request";
    return axiosClient.post(url, params);
  },
};

export default userAPI;
