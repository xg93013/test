import * as actionTypes from '../constants/index';
const nextList = (state = {}, action) => {
    switch (action.type) {
        case actionTypes.USERINFO:
            return action.data;
        default:
            return state
    }
};

export default nextList;