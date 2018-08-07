import React, { Component } from 'react';
import './App.css';
import SignUpCmp from './SignUpCmp.js';
import LoginCmp from './LoginCmp.js';
import SellerItemCmp from './SellerItemCmp.js';
import PurchaseItemCmp from './PurchaseItemCmp.js';

const assert = require('assert');


class App extends Component { 
  constructor () {
    super();
    this.state = {
      signUpForm : false,
      loginForm : false,
      sellerItemForm: false,
      purchaseItemForm : false,
      userCarItems: null
    }
    
  }
  
  componentDidMount() {
    //TODO: dummy data
    let userCarItemsDummy = {userId : 'user123', items: [{itemId: 'pwd123', quantityToCart:2 }, {itemId: 'pwd124', quantityToCart:3 }, {itemId: 'pwd125', quantityToCart:4 }]}
    this.setState({ purchaseItemForm: true, userCarItems: userCarItemsDummy});
  }

  render() {
    return (
       <div className="App">
        <SignUpCmp show={this.state.signUpForm} />
        <LoginCmp show={this.state.loginForm} />
        <SellerItemCmp show={this.state.sellerItemForm} />
        <PurchaseItemCmp show={this.state.purchaseItemForm} userCarItems={this.state.userCarItems} />
      </div>
    );
  }
}

export default App;
