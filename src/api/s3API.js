import s3_axiosClient from "./S3_AxiosClient";

const S3API = {
  sendFile: (params) => {
    return s3_axiosClient.put("", params);
  },
};

export default S3API;
