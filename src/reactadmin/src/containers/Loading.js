import React from "react";
import { connect } from "react-redux";
import { Icon } from "antd";
class Loading extends React.Component {
  render() {
    return (
      <div
        className="loadings"
        style={{ display: this.props.isLoading ? "block" : "none" }}
      >
        <div
          className="load-con"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: ("-50%", "-50%"),
            textAlign: "center"
          }}
        >
          <Icon type="sync" spin />
          <p>Loading</p>
        </div>
      </div>
    );
  }
}
export default connect(state => ({
  isLoading: state.isLoading
}))(Loading);
// export default connect(state => ({
//   isLoading: state.isLoading
// }))(Loading)
