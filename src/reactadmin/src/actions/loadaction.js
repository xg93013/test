import * as actionTypes from "../constants/index"
export function changeLoading(data) {
    return {
        type: actionTypes.ISLOADING,
        isLoading: data
    }
}