import React, { Component } from 'react';

class ItemDetailCmp extends Component {

    constructor() {
        super();
        this.state = { itemID: null, quantity: 0}
        this.handleInputQuantity = this.handleInputQuantity.bind(this);
        this.handleSubmitCart = this.handleSubmitCart.bind(this);
    }

    handleInputQuantity(event) {   
        event.preventDefault();     
        this.setState({ itemID: this.props.item[0].itemID, quantity: event.target.value })
    }

    handleSubmitCart(event) {
        event.preventDefault();
        this.props.setItemToCartFunction({itemID: this.state.itemID, quantity: this.state.quantity});
    }

    render() {
        return (
            this.props.item ?
            <div className='bg-modal'>
                <div className='modal-content-item'>
                <div className='close' onClick={this.props.handleItemClose}>+</div>
                    <div className='item-title'>ITEM DETAIL</div>
                    <img className='item-img' src={"/Images/items/" + this.props.item[0].category+"/"+this.props.item[0].image} height="200px" width="200px" />
                    <div className='item-details'>
                        <label>Item Id:{this.props.item[0].itemID}</label>
                        <label>Blurb:{this.props.item[0].blurb}</label>
                        <label>Description:{this.props.item[0].description}</label>
                        <label>Price:CAD $ {this.props.item[0].price}</label>
                        <div>
                            <form onSubmit={this.handleSubmitCart}> 
                                <input type="number" value={this.state.inputQuantity} onChange={this.handleInputQuantity} />
                                <input type="submit" value="Add to cart" />
                            </form>
                        </div>
                    </div>
                </div> 
            </div>
            : <div></div>
        )
    }
}

export default ItemDetailCmp;