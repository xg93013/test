import * as actionTypes from '../constants/index';
const initialState = {};
const nextList = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.USERINFO:
            return action.data;
            break;
        default:
            return state
    }
};

export default nextList;