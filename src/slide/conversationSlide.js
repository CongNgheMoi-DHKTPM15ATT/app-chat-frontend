import { createSlice } from "@reduxjs/toolkit";

const conversation = createSlice({
  name: "conversations",
  initialState: {
    conver: [],
  },
  reducers: {
    addConversation: (state, action) => {
      state.push(action.payload);
    },
    createConversations: (state, action) => {
      state.conver = action.payload;
    },
  },
});

const { reducer, actions } = conversation;
export const { addConversation, createConversations } = actions;
export default reducer;
