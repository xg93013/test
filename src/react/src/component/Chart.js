import React, { Component } from 'react'
import {Link} from 'react-router-dom'


export default class About extends Component {
    constructor(props){
        super(props)
        this.state = {
            mainChart: '132'
        }
    }
    render(){
        return (
            <div className="chartBox">
            </div>
        );
    }
}