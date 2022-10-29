import { createSlice } from "@reduxjs/toolkit";

const modalUpdateAccount = createSlice({
  name: "modalUpdateAccount",
  initialState: {
    openModal: false,
  },
  reducers: {
    showModalUpdateAccount: (state, action) => {
      state.openModal = true;
    },
    closeModalUpdateAccount: (state, action) => {
      state.openModal = false;
    },
  },
});

const { reducer, actions } = modalUpdateAccount;
export const { showModalUpdateAccount, closeModalUpdateAccount } = actions;
export default reducer;