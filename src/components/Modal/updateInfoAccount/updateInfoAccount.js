import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, DatePicker, Form, Input, Modal, Upload, Progress } from "antd";
import { setAccount } from "../../../slide/userSlide";
import { customDate } from "../../../utils/customDate";
import { faCameraRetro } from "@fortawesome/free-solid-svg-icons";
import { closeModalUpdateAccount } from "../../../slide/modalUpdateAccountSlide";
import Swal from "sweetalert2";
import userAPI from "../../../api/userAPI";

import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import moment from "moment";

function ModalUpdateInfoAccount() {
  const account = useSelector((state) => state.account.account);
  const modalUpdateAccount = useSelector(
    (state) => state.modalUpdateAccount.openModal
  );
  const dispatch = useDispatch();

  const handleCancel_modalUpdateAccount = () => {
    dispatch(closeModalUpdateAccount());
  };

  const [formUpdateUser] = Form.useForm();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    dispatch(setAccount);
    formUpdateUser.setFieldsValue({
      user_name: account.user_name,
      email: account.email,
      phone: account.phone,
      birth_day: moment(customDate(account.birth_day), 'DD/MM/YYYY')
    })
  }, []);

  useEffect(() => {
    let progressUpload = document.getElementById("progressUploadAvatar");
    if (progress === 0) {
      progressUpload.style.display = "none";
    } else {
      progressUpload.style.display = "block";
    }
  }, [progress])

  const showAlertSuccess = () => {
    Swal.fire({
      position: "top",
      width: 400,
      timerProgressBar: true,
      title: "Lưu thông tin thành công",
      //text: "Đăng nhập thành công",
      showConfirmButton: false,
      icon: "success",
      timer: 1000,
    });
  };

  const showAlertUploadAvatar = () => {
    Swal.fire({
      position: "center",
      width: 400,
      timerProgressBar: true,
      title: "Thay đổi avatar thành công  ",
      //text: "Đăng nhập thành công",
      showConfirmButton: false,
      icon: "success",
      timer: 1000,
    });
  };

  const submitUpdateUser = async (values) => {
    const params = {
      _id: account._id,
      data: {
        user_name: values.user_name,
        email: values.email,
        phone: values.phone,
        birth_day: values.birth_day.toLocaleString("en-SG", {
          timeZone: 'Asia/Singapore',
          hour12: false
        })
      }
    };

    try {
      const response = await userAPI.updateUser(params);
      const action = setAccount(response);
      dispatch(action);
      showAlertSuccess();
    } catch (error) {
      console.log("Fail when axios API get user by ID: " + error);
    }
  }

  // const handleOnChange = ({ file, fileList, event }) => {
  //   // console.log(file, fileList, event);
  //   //Using Hooks to update the state to the current filelist
  //   setDefaultFileList(fileList);
  //   //filelist - [{uid: "-1",url:'Some url to image'}]
  // };

  const requestUploadAvatar = async (options) => {

    const { onSuccess, onError, file, onProgress } = options;
    const formData = new FormData();
    formData.append("img", file);
    axios
      .put("https://codejava-app-anime.herokuapp.com/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        onUploadProgress: event => {
          console.log("zo progress")
          const percent = Math.floor((event.loaded / event.total) * 100);
          setProgress(percent);
          if (percent === 100) {
            setTimeout(() => setProgress(0), 1000);
          }
          onProgress({ percent: (event.loaded / event.total) * 100 });
        },
        mode: "no-cors",
      })
      .then(async function(response) {
        console.log("đã ok")
        document.getElementById("updateAvatarAccount").src = response.data.pathVideo;
        const params = {
          _id: account._id,
          data: {
            avatar: response.data.pathVideo,
          }
        };

        try {
          const response = await userAPI.updateUser(params);
          const action = setAccount(response);
          dispatch(action);
          showAlertUploadAvatar();
        } catch (error) {
          console.log("Fail when axios API get user by ID: " + error);
        }
        onSuccess("OK")
      })
      .catch(function() {
        console.log("FAILURE!!");
      });
  }



  return (
    <Modal
        title="Cập nhật thông tin cá nhân"
        open={modalUpdateAccount}
        //onOk={handleOk_modelAddFriend}
        onCancel={handleCancel_modalUpdateAccount}
        className="modal-modalUpdateAccount"
        footer={null}
        style={{overflow: "hidden"}}
        forceRender
        getContainer={false}
      >
        <div className="info-update-user">
          <div className="info-update-user-img">
              <Upload
                accept="image/*" 
                multiple={false}
                customRequest={requestUploadAvatar}
                showUploadList={false}>
                <img
                  id="updateAvatarAccount"
                  src={account.avatar}
                  alt="avatar" />
                
              </Upload>
              < FontAwesomeIcon className ="icon-camera" size="lg" icon = { faCameraRetro }/>
              < Progress id="progressUploadAvatar" style={{position: "absolute", bottom: -10}} percent={progress} />

            

          </div>

          <Form
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 14 }}
            layout="horizontal"
            form={formUpdateUser}
            onFinish={submitUpdateUser}
          >
            <Form.Item name="user_name" label="Tên người dùng">
              <Input />
            </Form.Item>
{/*            <Form.Item name="email" label="Email">
              <Input />
            </Form.Item>*/}
            <Form.Item name="phone" label="Số điện thoại">
              <Input />
            </Form.Item>
            <Form.Item
             name="birth_day" 
             label="Sinh nhật"
             getValueFromEvent={(onChange) => moment(onChange).format('DD/MM/YYYY')}
             getValueProps={(i) => ({values: moment(i).format('DD/MM/YYYY')})}>
              <DatePicker format={'DD/MM/YYYY'} defaultValue={moment(customDate(account.birth_day), 'DD/MM/YYYY')}/>
            </Form.Item>
            <Form.Item style={{display: "flex", justifyContent: "center",}}>
              <Button type="primary" htmlType="submit">
                Lưu thông tin 
              </Button>
            </Form.Item>
              

          </Form>
        </div>
      </Modal>
  );
}
export default ModalUpdateInfoAccount;