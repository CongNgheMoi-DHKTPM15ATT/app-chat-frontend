import { createSlice } from "@reduxjs/toolkit";

const videoCall = createSlice({
  name: "videoCall",
  initialState: {
    account: {
      senderId: "",
      receiverId: "",
      sender_name: "",
      receiver_name: "",
      type: "",
      connect: false,
    },
  },
  reducers: {
    setVideoCallAccount: (state, action) => {
      state.account = action.payload;
    },
    setVideoCallConnect: (state, action) => {
      state.account.connect = true;
    },
  },
});

const { reducer, actions } = videoCall;
export const { setVideoCallAccount, setVideoCallConnect } = actions;
export default reducer;
