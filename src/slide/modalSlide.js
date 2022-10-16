import { createSlice } from "@reduxjs/toolkit";

const modalLogout = createSlice({
  name: "modalLogout",
  initialState: {
    openModal: false,
  },
  reducers: {
    showModalLogout: (state, action) => {
      state.openModal = true;
    },
    closeModalLogout: (state, action) => {
      state.openModal = false;
    },
  },
});

const { reducer, actions } = modalLogout;
export const { showModalLogout, closeModalLogout } = actions;
export default reducer;
