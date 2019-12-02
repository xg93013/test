import { IS_LOADING } from "../actions/actions";

const isLoading = false;

export default function (state = isLoading, action) {

    switch (action.type) {

    case IS_LOADING: {
        return action.isLoading
    }

    default:
        return state
    }

}