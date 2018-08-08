import React, { Component } from 'react';
import common from './common.js';
import './App.css'

class SignUpCmp extends Component {

    constructor() {
        super();
        this.state = {
            signup: false,
            message: '',
            username: '',
            password: '',
            repassword: '',
            address: '',
            postalcode: '',
            phonenumber: '',
            email: ''
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
        this.handleInputEmail = this.handleInputEmail.bind(this);

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
        this.setState({ phonenumber: event.target.value })
    }

    handleInputAddress(event) {
        event.preventDefault();
        //this.setState({ contact: {address: event.target.value}})
        this.setState({ address: event.target.value })
    }

    handleInputPostalCode(event) {
        event.preventDefault();
        //this.setState({ contact: {postalcode: event.target.value}})
        this.setState({ postalcode: event.target.value })
    }

    handleInputEmail(event) {
        event.preventDefault();
        //this.setState({ contact: {email: event.target.value}})
        this.setState({ email: event.target.value })
    }

    handleSubmitRegister(event) {
        event.preventDefault();

        if (this.validateInputs()) {

            let bodyInfo = { username: this.state.username, password: this.state.password, contact: { address: this.state.address, postalcode: this.state.postalcode, phonenumber: this.state.phonenumber, email: this.state.email } };
            fetch('/signUp', {
                method: 'POST',
                body: JSON.stringify(bodyInfo)
            }).then(resp => resp.text())
                .then(respBody => {
                    let respBodyParser = JSON.parse(respBody);

                    //confirm sucess to app main
                    this.props.setSignUpSuccessFunction(respBodyParser.success);

                    //update state and rerender
                    this.setState({ signup: respBodyParser.success, message: respBodyParser.message })

                    //show messge
                    this.setState({ message: 'Sign up success' })
                })



        } else {
            //confirm fail to app main
            this.props.setSignUpSuccessFunction(false);

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
        let valEmail = !this.isStringEmpty(this.state.email);

        if (valUsername && valPassword && valRePassword && valAddress && valPhoneNumber && valPostalCode && valEmail) {
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
                <div className='bg-modal'>
                    <div className='modal-content-su'>
                        <form className='signUpForm' onSubmit={this.handleSubmitRegister}>
                            <div className='signUpCont'>
                                <div className='close' onClick={this.props.signUpClose}>+</div>
                                <h4>Account:</h4>
                                <div className ='signUpLabel'>Username:</div>
                                <input type="text" value={this.state.inputUsername} onChange={this.handleInputUsername} />
                                <div className ='signUpLabel'>Password:</div>
                                <input type="password" value={this.state.inputPassword} onChange={this.handleInputPassword} />
                                <div className ='signUpLabel'>Re-Password:</div>
                                <input type="password" value={this.state.inputRePassword} onChange={this.handleInputRePassword} />
                            </div>
                            <div className='signUpCont'>
                                <h4>Contact:</h4>
                                <div className='signUpLabel'>Phone number:</div>
                                <input type="text" value={this.state.phonenumber} onChange={this.handleInputPhoneNumber} />
                                <div className='signUpLabel'>Email:</div>
                                <input type="text" value={this.state.email} onChange={this.handleInputEmail} />
                                <div className='signUpLabel'>Address:</div>
                                <input type="text" value={this.state.address} onChange={this.handleInputAddress} />
                                <div className='signUpLabel'>Postal code:</div>
                                <input type="text" value={this.state.postalcode} onChange={this.handleInputPostalCode} />
                            </div>
                            <input className="buttonForm signUpB" type="submit" value="Join" />
                        </form>
                    </div>
                </div> : null
        )
    }
}

export default SignUpCmp;