import React, { Component } from 'react'


class MainBar extends Component {
    render() {
        return (
            <div className='mainBar'>
                <img className='logo' src={'/Images/logo_small.png'} onClick={this.props.clickHome}/>
                <div className='navForm'>
                    <form>
                        <input type='text' className='inputNav' />
                        <input type='image' src={'/Images/Icons/magnifying-glass.png'} className='buttonNav' />
                    </form>
                </div>
                <div className='infoNav'>
                    <label className='username'>{this.props.userName}{this.props.userName !== '' ? (<img width="20px" height="20px" src={'/Images/Icons/logout.png'} onClick={this.props.doLogout} />) : (<div></div>)}</label>
                    <label>&nbsp;&nbsp;&nbsp;</label>
                    <img className='shoppingCart' src={'/Images/Icons/shopping-cart.png'} onClick={this.props.showCart} />{this.props.cartUserItems}
                </div>
            </div>
        )
    }
}

export default MainBar