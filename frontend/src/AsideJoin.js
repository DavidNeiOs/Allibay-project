import React, { Component } from 'react'

class AsideJoin extends Component {
    render () {
        return(
            !this.props.userName ?
                <div className='asideJoin'>
                    <img className='avatar' src={'/Images/Icons/avatar.png'} />
                    <button className='regButton' onClick={this.props.handleSignUp}> Sign Up </button>
                    <label className='quest'> Already have an account ?</label>
                    <button className='regButton' onClick={this.props.handleLogIn}> Log In </button>
                </div>
            :
            <div className='asideJoin'>
                <button onClick={this.props.showItemsBought} className='lateB'>Items bought</button>
                <button onClick={this.props.showSellerItem} className='lateB'>Sell an item</button>
            </div>
        )
    }
}

export default AsideJoin