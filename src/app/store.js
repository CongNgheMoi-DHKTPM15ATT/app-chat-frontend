import { combineReducers, configureStore } from "@reduxjs/toolkit";
import messageReducer from "../slide/messageSlide";
import userReducer from "../slide/userSlide";
import chatReducer from "../slide/chatSlide";
import conversationReducer from "../slide/conversationSlide";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import thunk from "redux-thunk";

const rootReducer = combineReducers({
  account: userReducer,
  chat: chatReducer,
  message: messageReducer,
  conversation: conversationReducer,
});

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk],
});

export default store;
