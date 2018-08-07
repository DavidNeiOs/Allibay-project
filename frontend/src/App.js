import React, { Component } from 'react';
import RandomItems from './RandomItemsCmp'
import {BrowserRouter, Route} from 'react-router-dom'
import styled, { css } from 'styled-components'


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
  constructor () {
    super()
    this.state = {
      items: [],  // this list contains all the items
      randomItems: [], // this list contains 10 random items from the items list
      categories: []
    }
    this.getItems = this.getItems.bind(this)
    this.getRandomItems = this.getRandomItems.bind(this)
    this.renderMain = this.renderMain.bind(this)
    this.renderItem = this.renderItem.bind(this)
    
  }
  /*
    This function will load all the items from the server
    it expects as a response the array with all items
  */
  getItems() {
    fetch('/getAllItems')
      .then(response => response.text())
      .then(responseBody => {
        let parsedBody = JSON.parse(responseBody);
        this.setState({items: parsedBody.items});
        this.getRandomItems();
      })
  }
  /**
   * this function will get ten random items from array of items
   * this items will be store in the state.randomItems
   */
  
   getRandomItems() {
    let rItems = [] // this will be the array that will be assigned to state.randomItems
    for(let i = 0; i < 8; i++) {
      let index = Math.floor(Math.random() * this.state.items.length);
      rItems.push(this.state.items[index]);
    }
    this.setState({randomItems: rItems});
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
    if(matchingItem.length === 0) {
      return <div>invalid item code</div> // item not found
    }
    // item found
    return this.formatItem(matchingItem[0])  
  }
  
  componentDidMount() {
    this.getItems();
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
            <Logo src={'/Images/logo_small.png'}/>
            <SearchForm />
            <Label user> username </Label>
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
    );
  }
}

/*module.exports = {
  genUID, // This is just a shorthand. It's the same as genUID: genUID.
  initializeUserIfNeeded,
  putItemsBought,
  getItemsBought,
  createListing,
  getItemDescription,
  buy,
  allItemsSold
  // Add all the other functions that need to be exported
}*/

export default App;
