import React, { Component } from 'react';
import RandomItems from './RandomItemsCmp'
import { BrowserRouter, Route } from 'react-router-dom'
import styled, { css } from 'styled-components'

// logic Components-----------------------------------------------
import SignUpCmp from './SignUpCmp.js';
import LoginCmp from './LoginCmp.js';
import SellerItemCmp from './SellerItemCmp.js';
import PurchaseItemCmp from './PurchaseItemCmp.js';
// end -----------------------------------------------------------

// css Components ------------------------------------------------
import MainBar from './components/MainBar'
import Logo from './components/Logo'
import Label from './components/Label'
import ShoppingCart from './components/ShoppingCart'
import Wrapper from './components/Wrapper'
import Aside from './components/Aside'
import SearchForm from './components/SearchForm'
import Link from './components/Link'
import Button from './components/Button'
// end ------------------------------------------------------------

class App extends Component {
  constructor() {
    super()
    this.state = {
      items: [{ description: 'pencil', price: 500, itemID: 1 },
      { description: 'pen', price: 800, itemID: 2 },
      { description: 'car', price: 800, itemID: 3 },
      { description: 'dog', price: 700, itemID: 4 },
      { description: 'cat', price: 600, itemID: 5 },
      { description: 'dog1', price: 800, itemID: 6 },
      { description: 'dog2', price: 800, itemID: 7 },
      { description: 'dog3', price: 800, itemID: 8 },
      { description: 'dog4', price: 800, itemID: 9 },
      { description: 'dog5', price: 800, itemID: 10 },
      { description: 'dog6', price: 800, itemID: 11 },
      { description: 'dog7', price: 800, itemID: 12 }
      ],  // this list contains all the items
      randomItems: [], // this list contains 10 random items from the items list
      categories: [],
      signUpSuccess: false,
      userID: null, //this value chang when the login is success
      userName: ''
    }
    this.getItems = this.getItems.bind(this)
    this.getRandomItems = this.getRandomItems.bind(this)
    this.renderMain = this.renderMain.bind(this)
    this.renderItem = this.renderItem.bind(this)
    this.setSignUpSuccess = this.setSignUpSuccess.bind(this);
    this.setLoginSuccess = this.setLoginSuccess.bind(this);
  }
  /*
    This function will load all the items from the server
    it expects as a response the array with all items
  */
  getItems() {
    /*fetch('/getAllItems')
      .then(response => response.text())
      .then(responseBody => {
        let parsedBody = JSON.parse(responseBody);
        this.setState({items: parsedBody.items});
        this.getRandomItems();
      })*/
    this.getRandomItems();
  }
  /**
   * this function will get ten random items from array of items
   * this items will be store in the state.randomItems
   */

  getRandomItems() {
    let rItems = [] // this will be the array that will be assigned to state.randomItems
    for (let i = 0; i < 8; i++) {
      let index = Math.floor(Math.random() * this.state.items.length);
      rItems.push(this.state.items[index]);
    }
    this.setState({ randomItems: rItems });
  }

  /**
   * function formats an item to be shown
   * @param {the item which 'button' was clicked} item 
   */
  formatItem(item) {
    return (
      <div>
        <div> {item.description} </div>
        <div> {item.price} </div>
        <div> {item.itemID} </div>
      </div>
    )
  }

  /**
   * this function will check the url to get the itemID
   * and then will look in the item's database
   * when foun we will make it appear on screen with the format
   * of formatItem
   */
  renderItem(routerData) {
    let itemIdSupplied = parseInt(routerData.match.params.itemID);
    let matchingItem = this.state.items.filter(item => item.itemID === itemIdSupplied);
    if (matchingItem.length === 0) {
      return <div>invalid item code</div> // item not found
    }
    // item found
    return this.formatItem(matchingItem[0])
  }

  componentDidMount() {
    this.getItems();
  }

  setSignUpSuccess(success) {
    this.setState({ signUpSuccess: success })
  }

  setLoginSuccess(success, userId, username) {
    this.setState({ userID: userId, userName: username })
  }

  renderMain(routeProps) {
    return (
      this.state.randomItems.length === 0 ?
        <div>
          loading
        </div>
        :
        <div className="App">
          <MainBar>
            <Logo src={'/Images/logo_small.png'} />
            <SearchForm />
            <Label user>{this.state.userName}</Label>
            <ShoppingCart />
          </MainBar>
          <Wrapper>
            <Aside>
              <Link>Woman</Link>
              <Link>Man</Link>
              <Link>Shoes</Link>
              <Link>Watches</Link>
            </Aside>
            <RandomItems history={routeProps.history} randomItems={this.state.randomItems} />
            {!this.state.signUpSuccess ? (<SignUpCmp show={true} setSignUpSuccessFunction={this.setSignUpSuccess} />) : (<div></div>)}
            {!this.state.userID ? (<LoginCmp show={true} setLoginSuccessFunction={this.setLoginSuccess} />) : (<div></div>)}            
            <Aside join>
              <Logo src={'/Images/Icons/avatar.png'} avatar />
              <Button register> Sign Up </Button>
              <Label> Already have an account ?</Label>
              <Button register> Log In </Button>
            </Aside>
          </Wrapper>
        </div>
    )
  }

  render() {
    return (
      <BrowserRouter>
        <div>
          <Route path='/' exact render={this.renderMain} />
          <Route path='/item/:itemID' render={this.renderItem} />
        </div>
      </BrowserRouter>
    )
  }
}
/*class App extends Component { 
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
*/
export default App;
