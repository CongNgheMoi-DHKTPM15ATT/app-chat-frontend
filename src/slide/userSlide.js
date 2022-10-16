import { createSlice } from "@reduxjs/toolkit";

const user = createSlice({
  name: "user",
  initialState: {
    account: {
      _id: "",
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
