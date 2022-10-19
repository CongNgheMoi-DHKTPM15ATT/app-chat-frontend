import { createSlice } from "@reduxjs/toolkit";

const modelAddFriend = createSlice({
  name: "modelAddFriend",
  initialState: {
    openModal: false,
    user: {
      receiver_id: "",
    },
  },
  reducers: {
    showModelAddFriend: (state, action) => {
      state.openModal = true;
    },
    closeModelAddFriend: (state, action) => {
      state.openModal = false;
    },
    addUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

const { reducer, actions } = modelAddFriend;
export const { showModelAddFriend, closeModelAddFriend, addUser } = actions;
export default reducer;
