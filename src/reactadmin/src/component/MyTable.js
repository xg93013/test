import React, { Component } from 'react'
import { Table, Spin } from 'antd'
import 'antd/dist/antd.css'
import '../styles/mytable.scss'

export default class About extends Component {
    constructor(props){
        super(props)
        this.state = {}
    }
    render(){
        return (
            <div className="tableBox">
                <div className="loadings" style={{display: this.props.showLoading ? 'block' : 'none'}}>
                    <Spin tip="Loading..." size="small" wrapperClassName="spins" ></Spin>
                </div>
                <Table style={{display: this.props.showLoading ? 'none' : 'block'}} onRow={(record) => {
                    return {
                    onClick: () => {
                        // console.log(record)
                        this.props.rowClick(record)
                    },       // 点击行
                    onMouseEnter: () => {}
                    }  // 鼠标移入行
                }} 
                dataSource={this.props.dataSource} columns={this.props.columns}/>
            </div>
        );
    }
}