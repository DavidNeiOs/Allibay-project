import React, { Component } from 'react';

class ItemsBought extends Component {
    constructor() {
        super();
        this.state={itemsBought:[], date: new Date().toLocaleString()};
        this.getCarItems = this.getCarItems.bind(this);
        this.getTotalPurchase = this.getTotalPurchase.bind(this);
    }

    /*componentDidMount() {
        //call the end-point to get the items
        let bodyInfo = { userID: this.props.userID};
            fetch('/itemsBought', {
                method: 'POST',
                mode: 'same-origin',
                credentials: 'include',
                body: JSON.stringify(bodyInfo)
            }).then(resp => resp.text())
                .then(respBody => {
                    let respBodyParser = JSON.parse(respBody);                                        
                    //update state 
                    if (respBodyParser.success) {
                        this.setState({itemsBought: respBodyParser.items })                    
                    }                                         
                })
      }*/

    //TODO: CHANGE THIS METHODS WHEN THE ENDPOINT WORK, TO USE this.state.itemsBought INSTEAD OF this.props.userCartItemsDetail
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

    render() {
        return (
            this.props.show ?
                <div>
                        <div>
                            <h2>Items bought</h2>
                            <div className="rTable">
                                <div className="rTableRow">
                                    <div className="rTableHead"><strong>Item</strong></div>
                                    <div className="rTableHead"><strong>Price</strong></div>
                                    <div className="rTableHead"><strong>Quantity</strong></div>
                                    <div className="rTableHead"><strong>Subtotal</strong></div>
                                </div>
                                {this.getCarItems()}
                                <div className="rTableRow">
                                    <div className="rTableHead">Date:</div>
                                    <div className="rTableHead">{this.state.date}</div>
                                    <div className="rTableHead"><strong>Total: CDN$</strong></div>
                                    <div className="rTableHead"><strong>{this.getTotalPurchase()}</strong></div>
                                </div>
                            </div>
                            <label>{this.state.message}</label>
                        </div>
                </div>
                :
                null
        )
    }
}


export default ItemsBought;