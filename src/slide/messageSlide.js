import { createSlice } from "@reduxjs/toolkit";

const message = createSlice({
  name: "messages",
  initialState: [],
  reducers: {
    addMessage: (state, action) => {
      state.push(action.payload);
    },
    createMessages: (state, action) => {
      state = action.payload;
    },
  },
});

const { reducer, actions } = message;
export const { addMessage, createMessages } = actions;
export default reducer;
