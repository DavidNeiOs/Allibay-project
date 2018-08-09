import React, { Component } from 'react';
//import ReactTable from "react-table";
//import ItemDetailCmp from './ItemDetailCmp';

class PurchaseItemCmp extends Component {

    constructor() {
        super();
        this.state = {message : ''};
        this.getCarItems = this.getCarItems.bind(this);
        this.getTotalPurchase = this.getTotalPurchase.bind(this);
        this.handleSubmitPurchase = this.handleSubmitPurchase.bind(this);
    }

    getCarItems() {
        return this.props.userCartItemsDetail.map(item => (
            <div className="rTableRow">
                <div className="rTableCell"><label><img src={"/Images/items/" + item.category + "/" + item.image} height="50px" width="50px" />{item.blurb}</label></div>
                <div className="rTableCell">{item.price}</div>
                <div className="rTableCell">{item.quantity}</div>
                <div className="rTableCell">{item.price * item.quantity}</div>
            </div>
        ));
    }

    getTotalPurchase() {
        //TODO: use 'reduce' instead of this
        let total = 0;
        this.props.userCartItemsDetail.forEach(e => {
            total = total + (e.price * e.quantity);
        });
        return total;
    }

    handleSubmitPurchase(event) {
        event.preventDefault();

            let bodyInfo = { userID: this.props.userID, cart: this.props.userCartItems};
            fetch('/purchaseItem', {
                method: 'POST',
                mode: 'same-origin',
                credentials: 'include',
                body: JSON.stringify(bodyInfo)
            }).then(resp => resp.text())
                .then(respBody => {
                    let respBodyParser = JSON.parse(respBody);                    

                    //sending login confirmation to main app
                    //this.props.setLoginSuccessFunction(successRet, userIDRet, this.state.username);

                    //update state show the message
                    let msg = respBodyParser.success ? 'Transaction success #34565' : 'Transaction fail';
                    this.setState({ message: msg });    
                    this.props.handleCloseCart();         
                })
                
    }

    render() {
        return (
            this.props.show ?
                <div className='bg-modal'>
                    <div className='modal-content-sc'>
                        <form onSubmit={this.handleSubmitPurchase}>
                            <div>
                                <h2 className='sc-title'>Shoping cart</h2>
                                <div className="rTable">
                                    <div className="rTableRow">
                                        <div className="rTableHead"><strong>Item</strong></div>
                                        <div className="rTableHead"><strong>Price</strong></div>
                                        <div className="rTableHead"><strong>Quantity</strong></div>
                                        <div className="rTableHead"><strong>Subtotal</strong></div>
                                    </div>
                                    {this.getCarItems()}
                                    <div className="rTableRow">
                                        <div className="rTableHead">&nbsp;</div>
                                        <div className="rTableHead">&nbsp;</div>
                                        <div className="rTableHead"><strong>Total: CDN$</strong></div>
                                        <div className="rTableHead"><strong>{this.getTotalPurchase()}</strong></div>
                                    </div>
                                </div>
                                <input className='sc-button' type="submit" value="Purchase" />
                                <label>{this.state.message}</label>
                            </div>
                        </form>
                    </div>
                </div>
                :
                null
        )
    }
}

export default PurchaseItemCmp;