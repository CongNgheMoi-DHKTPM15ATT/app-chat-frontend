import { createSlice } from "@reduxjs/toolkit";

const modelAcountUser = createSlice({
  name: "modelAcountUser",
  initialState: {
    openModal: false,
  },
  reducers: {
    showModelAcountUser: (state, action) => {
      state.openModal = true;
    },
    closeModelAcountUser: (state, action) => {
      state.openModal = false;
    },
  },
});

const { reducer, actions } = modelAcountUser;
export const { showModelAcountUser, closeModelAcountUser } = actions;
export default reducer;
