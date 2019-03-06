import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Form,
  Icon,
  Button,
  Input,
  Checkbox,
  AutoComplete,
  Collapse,
  Carousel,
  Comment,
  Avatar,
  List,
  BackTop,
  Skeleton
} from "antd";
import "antd/dist/antd.css";
import { Slider } from "antd";
import { changeExt } from "upath";
import moment from "moment";

const FormItem = Form.Item;
const { TextArea } = Input;
const panelStyle = {
  background: "#f5f5f5",
  borderRadius: 4,
  marginBottom: 24,
  border: 0,
  overflow: "hidden"
};

const CommentList = ({ commentList, submitting }) => (
  <List
    dataSource={commentList}
    header={`${commentList.length} ${
      commentList.length > 1 ? "replies" : "reply"
      }`}
    itemLayout="horizontal"
    renderItem={item => (
      <List.Item>
        <Skeleton loading={submitting} active>
          <List.Item.Meta
            avatar={<Avatar src={item.avatar} />}
            title={item.datetime}
            description={item.content}
          />
        </Skeleton>
      </List.Item>
    )}
  />
);

export default class MyForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mainChart: "132",
      autoList: ["a", "aa", "aaa"],
      marks: {
        0: "0%",
        25: "25%",
        45: "45%",
        100: "100%"
      },
      submitting: false,
      commentList: []
    };
  }
  componentDidMount() { }
  hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  }
  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log("Received values of form: ", values);
      }
    });
  }
  nameFun(rule, value, callback) {
    if (value !== "xxx") {
      callback("名称不正确！");
    }
    callback();
  }
  onSelect(e) {
    console.log(e);
  }
  handleSearch(e) {
    console.log(e);
  }
  changeRange(range) {
    console.log(range);
  }
  changeArea(e) {
    // console.log(e);
    this.setState({
      textarea: e.target.value
    });
  }
  onSubmit() {
    this.setState({
      submitting: true
    });
    setTimeout(() => {
      this.setState({
        submitting: false,
        commentList: [
          {
            avatar: "",
            content: <p>{this.state.textarea}</p>,
            datetime: moment().fromNow()
          },
          ...this.state.commentList
        ]
      });
    }, 2000);
  }
  setNextList() {
    // this.props.nextActions.updateNext(this.state);
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="formBox">
        <BackTop>up</BackTop>
        <Form onSubmit={this.handleSubmit.bind(this)} className="login-form">
          <Form.Item>
            {getFieldDecorator("userName", {
              rules: [
                {
                  required: true,
                  message: "Please input your username!",
                  min: 3,
                  max: 5
                }
                // {
                //   validator: this.nameFun
                // }
              ],
              trigger: "onChange"
            })(
              <Input
                prefix={
                  <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                placeholder="Username"
              />
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator("password", {
              rules: [
                { required: true, message: "Please input your Password!" }
              ]
            })(
              <Input
                prefix={
                  <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                type="password"
                placeholder="Password"
                addonAfter="after"
                addonBefore="before"
              />
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator("remember", {
              valuePropName: "checked",
              initialValue: true
            })(<Checkbox>Remember me</Checkbox>)}
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              Login
            </Button>
          </Form.Item>
        </Form>
        <AutoComplete
          dataSource={this.state.autoList}
          style={{ width: 200 }}
          onSelect={this.onSelect}
          onSearch={this.handleSearch}
          placeholder="input here"
        />
        <Slider
          marks={this.state.marks}
          range
          defaultValue={[25, 45]}
          onChange={this.changeRange}
        />
        <Collapse
          defaultActiveKey={["1"]}
          style={{ width: "200px", background: "#eee" }}
        >
          <Collapse.Panel
            header="this is first"
            key={1}
            style={panelStyle}
            showArrow={false}
          >
            <p>this is first content</p>
          </Collapse.Panel>
          <Collapse.Panel header="this is first" key={2} style={panelStyle}>
            <p>this is next content</p>
          </Collapse.Panel>
        </Collapse>
        {/* <div className="lists" commentList.len></div> */}
        {this.state.commentList.length > 0 && (
          <CommentList
            commentList={this.state.commentList}
            submitting={this.state.submitting}
          />
        )}
        <div>
          <Form.Item>
            <TextArea
              rows={4}
              onChange={this.changeArea.bind(this)}
              value={this.state.textarea}
            />
          </Form.Item>
          <Form.Item>
            <Button
              htmlType="submit"
              loading={this.state.submitting}
              onClick={this.onSubmit.bind(this)}
              type="primary"
            >
              Add Comment
            </Button>
          </Form.Item>
        </div>
        <Button onClick={this.setNextList.bind(this)}>setNext</Button>
        <Carousel autoplay>
          <div>content</div>
          <div>content</div>
          <div>content</div>
          <div>content</div>
        </Carousel>
        <Form>
          <FormItem>
            <Input
              prefix={
                <Icon
                  type="user"
                  style={{
                    color: "rgba(0,0,0,.25)"
                  }}
                />
              }
              placeholder="Username"
            />
          </FormItem>
          <FormItem>
            <Input
              prefix={
                <Icon
                  type="user"
                  style={{
                    color: "rgba(0,0,0,.25)"
                  }}
                />
              }
              placeholder="pwd"
            />
          </FormItem>
        </Form>
      </div>
    );
  }
}
