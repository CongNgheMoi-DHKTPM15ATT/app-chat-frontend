import { createSlice } from "@reduxjs/toolkit";

const chat = createSlice({
  name: "chat",
  initialState: {
    account: {
      receiver_nick_name: "",
      user_nick_name: "",
      conversation_id: "",
      receiver_id: "",
      avatar: "",
    },
  },
  reducers: {
    setChatAccount: (state, action) => {
      state.account = action.payload;
    },
  },
});

const { reducer, actions } = chat;
export const { setChatAccount } = actions;
export default reducer;