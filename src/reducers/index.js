import { combineReducers } from "redux";

import LoginReducer from "./LoginReducer";
import UserReducer from "./UserReducer";

const combineReducer = combineReducers({
  LoginReducer,
  UserReducer,
});

export default combineReducer;
