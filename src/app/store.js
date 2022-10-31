import { combineReducers, configureStore } from "@reduxjs/toolkit";
import messageReducer from "../slide/messageSlide";
import userReducer from "../slide/userSlide";
import chatReducer from "../slide/chatSlide";
import conversationReducer from "../slide/conversationSlide";
import modalLogoutReducer from "../slide/modalSlide";
import modelAddFriendReducer from "../slide/modalAddFriendSlide";
import modelAcountUserReducer from "../slide/modelAcountSlide";
import modalUpdateAccountReducer from "../slide/modalUpdateAccountSlide";
import videoCallReducer from "../slide/videoCallSlide";
import modalCreateGroupReducer from "../slide/modalCreateGroup";
import modalAddUserGroupReducer from "../slide/modalAddUserGroup";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import thunk from "redux-thunk";

const rootReducer = combineReducers({
  account: userReducer,
  chat: chatReducer,
  conversation: conversationReducer,
  modalLogout: modalLogoutReducer,
  modelAddFriend: modelAddFriendReducer,
  modelAcountUser: modelAcountUserReducer,
  videoCall: videoCallReducer,
  modalUpdateAccount: modalUpdateAccountReducer,
  modalCreateGroup: modalCreateGroupReducer,
  modalAddUserGroup: modalAddUserGroupReducer,
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
