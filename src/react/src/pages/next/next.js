import React, { Component } from 'react'
import axios from 'axios'
import '../../styles/next.scss'
// const baseUrl = process.env.NODE_ENV === 'development' ? '/api' : ''
import Header from '../header/header'
import Nav from '../nav/nav'
import Page2 from '../page2'
import DateSelect from '../../component/DateSelect'

export default class About extends Component {
    constructor(props) {
        super(props)
        this.state = {
            text: 'parentData'
        }
    }
    getData() {
        axios.get('/api/getUserInfo').then(response => {
            // console.log(response)
        });
    }
    getAllData() {

    }
    changeText(newText) {
        this.setState({
            text: newText
        })
    }
    componentDidMount() {
        this.getData()
    }
    render() {
        return (
            <div className="nextCon">
                <Header headTitle={this.state.headTitle}/>
                <Nav {...this.props}></Nav>
                <div className="next">
                <DateSelect />
                <Page2 parentData={this.state.text} changeText={newText => this.changeText(newText)}></Page2>
                </div>
                
            </div>
        );
    }
}