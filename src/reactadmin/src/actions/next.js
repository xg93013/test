/**
 * Created by 0easy-23 on 2017/9/14.
 */
import * as actionTypes from '../constants/index';
const updateNext = (data) => {
    console.log(data)
    return {
        type: actionTypes.USERINFO,
        data
    }
};
export {updateNext};
