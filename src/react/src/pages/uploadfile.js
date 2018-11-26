import React,  {Component }from 'react'

export default class Uploadfile extends Component {
    constructor(props) {
        super(props)
        this.state =  {
            uploadfile:'132'
        }
    }
    fileReader(e) {
        let reader = new FileReader(); 
        reader.readAsDataURL(e.target.files[0]); 
        reader.onload = (e) =>  {
            // console.log(e.target.result);
            this.setState( {
                uploadfile:e.target.result
            })
        }
    }
    render() {
        return ( < div className = "filereader" >  < input type = "file"onChange =  {this.fileReader}/>  < div className = "imgPos" style = "{}" >< img src =  {uploadfile}/></div >  </div > 
        ); 
    }
}