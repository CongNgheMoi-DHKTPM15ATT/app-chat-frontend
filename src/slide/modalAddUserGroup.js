import { createSlice } from "@reduxjs/toolkit";

const modalAddUserGroup = createSlice({
  name: "modalAddUserGroup",
  initialState: {
    openModal: false,
  },
  reducers: {
    showModalAddUserGroup: (state, action) => {
      state.openModal = true;
    },
    closeModalAddUserGroup: (state, action) => {
      state.openModal = false;
    },
  },
});

const { reducer, actions } = modalAddUserGroup;
export const { showModalAddUserGroup, closeModalAddUserGroup } = actions;
export default reducer;
