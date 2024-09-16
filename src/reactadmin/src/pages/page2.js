import React, { Component } from 'react'

export default class Page2 extends Component {
    constructor(props){
        super(props)
        this.state = {
            text: '132',
        }
    }
    componentDidMount(){
        setTimeout(()=>{
            this.props.changeText('changeText')
        },1000)
    }
    render(){
        return (
            <div className="about">
                {this.props.parentData}aasdsd
            </div>
        );
    }
}
// export default Page2

