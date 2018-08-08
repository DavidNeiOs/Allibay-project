import React, { Component } from 'react'

class AsideJoin extends Component {
    render () {
        return(
            !this.props.logInSucces || !this.props.signUpSuccess ?
                <div className='asideJoin'>
                    <img className='avatar' src={'/Images/Icons/avatar.png'} />
                    <button className='regButton' onClick={this.props.handleSignUp}> Sign Up </button>
                    <label className='quest'> Already have an account ?</label>
                    <button className='regButton' onClick={this.props.handleLogIn}> Log In </button>
                </div>
            :
                <div className='asideJoin'>
                </div>
        )
    }
}

export default AsideJoin