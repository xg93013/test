import {combineReducers} from "redux";
import isLoading from "./is-loading";

const allReducers = {
    isLoading
}

const rootReducer = combineReducers(allReducers);

export default rootReducer;