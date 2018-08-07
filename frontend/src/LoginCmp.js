import React, { Component } from 'react';
import common from './common.js';

class LoginCmp extends Component {

    constructor() {
        super();
        this.state = { login: false, username: '', password: '', userID: '' , message: ''};
        this.handleInputUsername = this.handleInputUsername.bind(this);
        this.handleInputPassword = this.handleInputPassword.bind(this);
        this.handleSubmitLogin = this.handleSubmitLogin.bind(this);

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

    handleSubmitLogin(event) {
        event.preventDefault();

        if (!this.isStringEmpty(this.state.username) && !this.isStringEmpty(this.state.password)) {

            let bodyInfo = { username: this.state.username, password: this.state.password };
            /*fetch('/login', {
                method: 'POST',
                mode: 'same-origin',
                credentials: 'include',
                body: JSON.stringify(bodyInfo)
            }).then(resp => resp.text())
                .then(respBody => {
                    let respBodyParser = JSON.parse(respBody);
                    let successRet = respBodyParser.success;
                    let userIDRet = respBodyParser.userID;

                    //sending login confirmation to main app
                    this.props.setLoginSuccessFunction(successRet, userIDRet);

                    //update state and rerender
                    this.setState({ login: successRet, userID: userIDRet })
                })*/
                this.setState({ message: 'login success' })

        } else {
            this.setState({ message: 'validation error' })
        }

    }

    isStringEmpty(str) {
        return (str === null || str === undefined || str === "" || str.trim().length === 0);
    }

    render() {
        return (
            this.props.show ?
                <div>
                    <div>
                        <h4>Login:</h4>
                        <form onSubmit={this.handleSubmitLogin}>
                            <div>Username: <input type="text" value={this.state.username} onChange={this.handleInputUsername} /></div>
                            <div>Password: <input type="password" value={this.state.password} onChange={this.handleInputPassword} /></div>
                            <div><input type="submit" value="Send" /></div>
                        </form>
                    </div>
                    <div>{this.state.message}</div>
                </div> : null
        )
    }
}

export default LoginCmp;

/*

return (<div>
        {!this.state.login ? 
        (<div>
            <h4>Please, enter:</h4>
            <form onSubmit={this.handleSubmitLogin}>
                <div>Username: <input type="text" value={this.state.username} onChange={this.handleInputUsername} /></div>
                <div>Password: <input type="password" value={this.state.password} onChange={this.handleInputPassword} /></div>                
                <div><input type="submit" value="Send" /></div>
            </form>

        </div>) : (<div>Login success!, enjoy chat!!</div>)}        
        </div>)

*/