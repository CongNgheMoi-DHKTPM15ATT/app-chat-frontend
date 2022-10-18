import { createSlice } from "@reduxjs/toolkit";

const modelAddFriend = createSlice({
  name: "modelAddFriend",
  initialState: {
    openModal: false,
  },
  reducers: {
    showModelAddFriend: (state, action) => {
      state.openModal = true;
    },
    closeModelAddFriend: (state, action) => {
      state.openModal = false;
    },
  },
});

const { reducer, actions } = modelAddFriend;
export const { showModelAddFriend, closeModelAddFriend } = actions;
export default reducer;
