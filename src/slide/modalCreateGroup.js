import { createSlice } from "@reduxjs/toolkit";

const modalCreateGroup = createSlice({
  name: "modalCreateGroup",
  initialState: {
    openModal: false,
  },
  reducers: {
    showModalCreateGroup: (state, action) => {
      state.openModal = true;
    },
    closeModalCreateGroup: (state, action) => {
      state.openModal = false;
    },
  },
});

const { reducer, actions } = modalCreateGroup;
export const { showModalCreateGroup, closeModalCreateGroup } = actions;
export default reducer;
