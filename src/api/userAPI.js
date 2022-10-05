import axiosClient  from "./axiosClient"

export const userApi = {
    // loginAccount: (params) => {
    //     const url = "/iuhcoder/api/login/login_by_account/";
    //     return axiosCLient.post(url, params);
    // },
    
    getAll: (params) =>{
        const url = '/products';
        return axiosClient.get(url, { params });
    },

}  