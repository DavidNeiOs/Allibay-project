import React, { Component } from 'react';
import ReactTable from "react-table";

class PurchaseItemCmp extends Component {

    constructor() {
        super();
        this.getCarItems = this.getCarItems.bind(this);
    }

    getCarItems() {
        return this.props.userCarItems.items;
    }
    render() {
        const columns = [{
            Header: 'Item id',
            accessor: 'itemId' 
          }, {
            Header: 'Price',
            accessor: 'quantityToCart'           
          }];

        return (
            this.props.show ?
                <div>
                    <form onSubmit={this.handleSubmitPurchase}>
                    <div>Shoping cart</div>                    
                    <div><ReactTable expandedRows={true} data={this.getCarItems()} columns={columns} /></div>
                    <div>SubTotal: CDN$ 300.00</div>
                    <input type="submit" value="Purchase" />
                    </form>
                </div>
                :
                <div></div>
        )
    }
}

export default PurchaseItemCmp;

/*
{this.getCarItems().map(item => (<div className="carItemTable"><div>{item.itemId}</div><div>{item.quantityToCart}</div></div>))}
                    <ReactTable data={data} columns={columns} />
*/