import axiosClient from "./axiosClient";

const userAPI = {
  // loginAccount: (params) => {
  //     const url = "/iuhcoder/api/login/login_by_account/";
  //     return axiosCLient.post(url, params);
  // },

  RegisterByUserName: (params) => {
    const url = "/auth/register";
    return axiosClient.post(url,params);
  },
  loginByUserName: (params) => {
    const url = "/auth/login";
    return axiosClient.post(url,params);
  },
  // getAll: (params) => {
  //   const url = "/products";
  //   return axiosClient.get(url, { params });
  // },
}

export default userAPI;
