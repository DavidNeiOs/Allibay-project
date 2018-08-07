import React, { Component } from 'react';
import RandomItems from './RandomItemsCmp'
import { BrowserRouter, Route } from 'react-router-dom'
import styled, { css } from 'styled-components'
import './App.css'

// logic Components-----------------------------------------------
import SignUpCmp from './SignUpCmp.js';
import LoginCmp from './LoginCmp.js';
import SellerItemCmp from './SellerItemCmp.js';
import PurchaseItemCmp from './PurchaseItemCmp.js';
// end -----------------------------------------------------------
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
      loginClicked: false,
      userID: null, //this value chang when the login is success
      userName: ''
    }
    this.getItems = this.getItems.bind(this)
    this.getRandomItems = this.getRandomItems.bind(this)
    this.renderMain = this.renderMain.bind(this)
    this.renderItem = this.renderItem.bind(this)
    this.setSignUpSuccess = this.setSignUpSuccess.bind(this);
    this.setLoginSuccess = this.setLoginSuccess.bind(this);
    this.handleLogIn = this.handleLogIn.bind(this)
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
  handleLogIn() {
    this.setState({loginClicked: true})
  }

  renderMain(routeProps) {
    return (
      this.state.randomItems.length === 0 ?
        <div>
          loading
        </div>
        :
        <div className="App">
          <div className='mainBar'>
            <img className='logo' src={'/Images/logo_small.png'}/>
            <form>
              <input type='text' className='inputNav' />
              <input type='image' src={'/Images/Icons/magnifying-glass.png'} className='buttonNav' />
            </form>
            <label className='username'> username </label>
            <img className='shoppingCart' src={'/Images/Icons/shopping-cart.png'} />
          </div>
          <div className='wrapper'>
            <div className='aside'>
              <a className='links'>Woman</a>
              <a className='links'>Man</a>
              <a className='links'>Shoes</a>
              <a className='links'>Watches</a>
            </div>
            <RandomItems history={routeProps.history} randomItems={this.state.randomItems} />
            <div className='asideJoin'>
              <img className='avatar' src={'/Images/Icons/avatar.png'} />
              <button className='regButton'> Sign Up </button>
              <label className='quest'> Already have an account ?</label>
              <button className='regButton' onClick={this.handleLogIn}> Log In </button>
            </div>
            
          </div>
          <div className='li-modal'>
            <LoginCmp show={this.state.loginClicked} setLoginSuccessFunction={this.setLoginSuccess} />
          </div>
        </div>
    )
  }
  // {!this.state.signUpSuccess ? (<SignUpCmp show={true} setSignUpSuccessFunction={this.setSignUpSuccess} />) : (<div></div>)}
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

export default App;
