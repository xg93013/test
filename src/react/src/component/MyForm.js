import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import { Form, Icon, Button, Input } from 'antd'
import 'antd/dist/antd.css'

const FormItem = Form.Item;


export default class About extends Component {
    constructor(props){
        super(props)
        this.state = {
            mainChart: '132'
        }
    }
    componentDidMount(){
        this.props.form.validateFields();
    }
    hasErrors(fieldsError) {
        return Object.keys(fieldsError).some(field => fieldsError[field]);
    }
    handleSubmit(e){
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
        if (!err) {
            console.log('Received values of form: ', values);
        }
        });
    }
    render(){
        // const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;

        // // Only show error after a field is touched.
        // const userNameError = isFieldTouched('userName') && getFieldError('userName');
        // const passwordError = isFieldTouched('password') && getFieldError('password');
        return (
            <div className="formBox">
            {/* <Form layout="inline" onSubmit={this.handleSubmit}>
                <FormItem
                validateStatus={userNameError ? 'error' : ''}
                help={userNameError || ''}
                >
                {getFieldDecorator('userName', {
                    rules: [{ required: true, message: 'Please input your username!' }],
                })(
                    <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
                )}
                </FormItem>
                <FormItem
                validateStatus={passwordError ? 'error' : ''}
                help={passwordError || ''}
                >
                {getFieldDecorator('password', {
                    rules: [{ required: true, message: 'Please input your Password!' }],
                })(
                    <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
                )}
                </FormItem>
                <FormItem>
                <Button
                    type="primary"
                    htmlType="submit"
                    disabled={this.hasErrors(getFieldsError())}
                >
                    Log in
                </Button>
                </FormItem>
            </Form> */}
            <Form>
                <FormItem><Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" /></FormItem>
                <FormItem><Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="pwd" /></FormItem>
            </Form>
            </div>
        );
    }
}