import { createSlice } from "@reduxjs/toolkit";

const user = createSlice({
  name: "user",
  initialState: {
    account: {
      id: "",
      user_name: "",
      phone: "",
      email: "",
    },
  },
  reducers: {
    setAccount: (state, action) => {
      state.account = action.payload;
    },
  },
});

const { reducer, actions } = user;
export const { setAccount } = actions;
export default reducer;
