import { createSlice } from "@reduxjs/toolkit";

const chat = createSlice({
  name: "chat",
  initialState: {
    account: {
      id: "",
      user_name: "",
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
