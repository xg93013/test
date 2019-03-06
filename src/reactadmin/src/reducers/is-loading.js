import * as actionTypes from "../constants/index";
const isLoading = false;
// const isloading = (state = isLoading, action) => {
//     switch (action.type) {
//         case actionTypes.ISLOADING:
//             return action.isLoading;
//         default:
//             return state
//     }
// };

// export default isloading;
export default function(state = isLoading, action) {
  switch (action.type) {
    case actionTypes.ISLOADING:
      return action.isLoading;
    default:
      return state;
  }
}
