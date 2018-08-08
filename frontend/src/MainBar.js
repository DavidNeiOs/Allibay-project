import React, { Component } from 'react'


class MainBar extends Component {
    render() {
        return (
            <div className='mainBar'>
                <img className='logo' src={'/Images/logo_small.png'} />
                <form className='navForm'>
                    <input type='text' />
                    <input type='image' src={'/Images/Icons/magnifying-glass.png'} className='buttonNav' />
                </form>
                <div className='infoNav'>
                    <label className='username'>{this.props.userName}{this.props.userName !== '' ? (<img width="20px" height="20px" src={'/Images/Icons/logout.png'} onClick={this.props.doLogout} />) : (<div>not user</div>)}</label>
                    <label>&nbsp;&nbsp;&nbsp;</label>
                    <img className='shoppingCart' src={'/Images/Icons/shopping-cart.png'} onClick={this.props.showCart} />{this.props.cartUserItems.length}
                </div>
                <button onClick={this.props.showItemsBought} className='lateB'>Items bought</button>
                <button onClick={this.props.showSellerItem} className='lateB'>Seller an item</button>
                <button onClick={this.props.showItemsSold} className='lateB'>Sold history</button>
            </div>
        )
    }
}

export default MainBar