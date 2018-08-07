import React, { Component } from 'react';
import common from './common.js';

//const TITLE_FORM = '';
class SignUpCmp extends Component {

    constructor() {
        super();
        this.state = {
            signup: false,
            message: '',
            username: '',
            password: '',
            repassword: '',
            address:'',
            postalcode:'',
            phonenumber:''
            //contact: { address: '', postalcode: '', phonenumber: '' }
        }
        //this.common = new common();
        this.handleSubmitRegister = this.handleSubmitRegister.bind(this);
        this.handleInputUsername = this.handleInputUsername.bind(this);
        this.handleInputPassword = this.handleInputPassword.bind(this);
        this.handleInputRePassword = this.handleInputRePassword.bind(this);
        this.handleInputPhoneNumber = this.handleInputPhoneNumber.bind(this);
        this.handleInputAddress = this.handleInputAddress.bind(this);
        this.handleInputPostalCode = this.handleInputPostalCode.bind(this);

        this.validateInputs = this.validateInputs.bind(this);

        //TODO: borrar
        this.isStringEmpty = this.isStringEmpty.bind(this);
    }

    handleInputUsername(event) {   
        event.preventDefault();     
        this.setState({ username: event.target.value })
    }

    handleInputPassword(event) {
        event.preventDefault();        
        this.setState({ password: event.target.value })
    }
    handleInputRePassword(event) {        
        event.preventDefault();
        this.setState({ repassword: event.target.value })
    }

    handleInputPhoneNumber(event) {
        event.preventDefault();
        //this.setState({ contact: {phonenumber: event.target.value}})
        this.setState({ phonenumber: event.target.value})
    }

    handleInputAddress(event) {
        event.preventDefault();
        //this.setState({ contact: {address: event.target.value}})
        this.setState({address: event.target.value})
    }

    handleInputPostalCode(event) {
        event.preventDefault();
        //this.setState({ contact: {postalcode: event.target.value}})
        this.setState({postalcode: event.target.value})
    }


    handleSubmitRegister(event) {
        event.preventDefault();

        if (this.validateInputs()) {

            let bodyInfo = { username: this.state.username, password: this.state.password, contact: {address: this.state.address, postalcode: this.state.postalcode, phonenumber: this.state.phonenumber, email:'linda@gmail.com'} };
            fetch('/signUp', {
                method: 'POST',
                body: JSON.stringify(bodyInfo)
            }).then(resp => resp.text())
                .then(respBody => {
                    let respBodyParser = JSON.parse(respBody);

                    //confirm sucess to app main
                    //this.props.setSignUpSuccessFunction(respBodyParser.success);

                    //update state and rerender
                    this.setState({ signup: respBodyParser.success, message: respBodyParser.message})
                })*/

            this.setState({ message: 'sign up success' })

        } else {
            //confirm fail to app main
            //this.props.setSignUpSuccessFunction(false);

            //update state and rerender
            this.setState({ message: 'field validation error' })
        }
    }

    validateInputs() {

        let valUsername = !this.isStringEmpty(this.state.username);
        let valPassword = !this.isStringEmpty(this.state.password);
        let valRePassword = !this.isStringEmpty(this.state.repassword);
        let valAddress = !this.isStringEmpty(this.state.address);
        let valPhoneNumber = !this.isStringEmpty(this.state.phonenumber);
        let valPostalCode = !this.isStringEmpty(this.state.postalcode);

        if (valUsername && valPassword && valRePassword && valAddress && valPhoneNumber && valPostalCode) {
            if (this.state.password === this.state.repassword) {
                return true;
            }            
        } 
        return false;
    }
 
    isStringEmpty(str) {
        return (str === null || str === undefined || str === "" || str.trim().length === 0);
    }

    render() {
        return (
            this.props.show ?
                <div>
                    <div>
                        <form onSubmit={this.handleSubmitRegister}>
                            <div>
                                <div><h4>Account:</h4></div>
                                <div>
                                    <div>Username:<input type="text" value={this.state.inputUsername} onChange={this.handleInputUsername} /></div>
                                    <div>Password:<input type="password" value={this.state.inputPassword} onChange={this.handleInputPassword} /></div>
                                    <div>Re-Password:<input type="password" value={this.state.inputRePassword} onChange={this.handleInputRePassword} /></div>
                                </div>
                            </div>
                            <div>
                                <div><h4>Contact:</h4></div>
                                <div>
                                    <div>Phone number:<input type="text" value={this.state.phonenumber} onChange={this.handleInputPhoneNumber} /></div>
                                    <div>Address:<input type="text" value={this.state.address} onChange={this.handleInputAddress} /></div>
                                    <div>Postal code:<input type="text" value={this.state.postalcode} onChange={this.handleInputPostalCode} /></div>
                                </div>
                            </div>
                            <div><input className="buttonForm" type="submit" value="Send" /></div>
                        </form>
                    </div>
                    <div>{this.state.message}</div>
                </div> : null
        )
    }
}

export default SignUpCmp;