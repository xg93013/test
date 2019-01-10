import {connect} from 'react-redux';
import next from '../pages/next/next';
import * as nextAction from '../actions/next';
import {bindActionCreators} from 'redux';
const mapStateToProps = (state) => {
    console.log(state)
    return {
        nextList: Object.assign({}, state.nextList)
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        nextActions: bindActionCreators(nextAction, dispatch)
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(next);