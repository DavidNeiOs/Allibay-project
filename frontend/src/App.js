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
import ItemDetailCmp from './ItemDetailCmp.js';
// end -----------------------------------------------------------

class App extends Component {
  constructor() {
    super()
    this.state = {
      items: [
      { itemID: 1 , blurb: 'shoes nike 1', description: 'lorem ipsum ...', price: 500, category: 'shoes', image:'tennisNikeRed.png'},
      { itemID: 2 , blurb: 'shoes nike 2', description: 'lorem ipsum ...', price: 800, category: 'shoes', image:'tennisNikeRed.png'},
      { itemID: 3 , blurb: 'shoes nike 3', description: 'lorem ipsum ...', price: 800, category: 'shoes', image:'tennisNikeRed.png'},
      { itemID: 4 , blurb: 'shoes nike 4', description: 'lorem ipsum ...', price: 700, category: 'shoes', image:'tennisNikeRed.png'},
      { itemID: 5, blurb: 'shoes nike 5', description: 'lorem ipsum ...', price: 600, category: 'shoes', image:'tennisNikeRed.png'},
      { itemID: 6 , blurb: 'shoes nike 6', description: 'lorem ipsum ...', price: 800, category: 'shoes', image:'tennisNikeRed.png'},
      { itemID: 7 , blurb: 'shoes nike 7', description: 'lorem ipsum ...', price: 800, category: 'shoes', image:'tennisNikeRed.png'},
      { itemID: 8 , blurb: 'shoes nike 8', description: 'lorem ipsum ...', price: 800, category: 'shoes', image:'tennisNikeRed.png'},
      { itemID: 9 , blurb: 'shoes nike 9', description: 'lorem ipsum ...', price: 800, category: 'shoes', image:'tennisNikeRed.png'},
      { itemID: 10 , blurb: 'shoes nike 10', description: 'lorem ipsum ...', price: 800, category: 'shoes', image:'tennisNikeRed.png'},
      { itemID: 11 , blurb: 'shoes nike 11', description: 'lorem ipsum ...', price: 800, category: 'shoes', image:'tennisNikeRed.png'},
      { itemID: 12 , blurb: 'shoes nike 12', description: 'lorem ipsum ...', price: 800, category: 'shoes', image:'tennisNikeRed.png' }
      ],  // this list contains all the items
      randomItems: [], // this list contains 10 random items from the items list
      categories: [],
      signUpSuccess: false,
      loginClicked: false,
      userID: null, //this value chang when the login is success
      userName: '',
      item: null,
      cartUserItems: [],
      cartUserItemsDetail: [],
      showCart: false
    }
    this.getItems = this.getItems.bind(this)
    this.getRandomItems = this.getRandomItems.bind(this)
    this.renderMain = this.renderMain.bind(this)
    this.renderItem = this.renderItem.bind(this)
    this.setSignUpSuccess = this.setSignUpSuccess.bind(this);
    this.setLoginSuccess = this.setLoginSuccess.bind(this);
    this.handleLogIn = this.handleLogIn.bind(this)
    this.doLogout = this.doLogout.bind(this);
    this.setItemToDetail = this.setItemToDetail.bind(this);
    this.setItemToCart = this.setItemToCart.bind(this);
    this.showCart = this.showCart.bind(this);
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

  setItemToDetail(itemID) {
    let matchingItem = this.state.items.filter(item => item.itemID === itemID);
    this.setState({ item: matchingItem })
  }

  setItemToCart(item) { 
    let carItems = this.state.cartUserItems;  
    carItems.push(item);
    this.setState({ cartUserItems: carItems })
  }

  doLogout(){
    //TODO: REMOVE THE COOKIE!!!
    let bodyInfo = {username :  this.state.userName} ;
    fetch('/logout', {
      method: 'POST',
      body: JSON.stringify(bodyInfo)
    }).then(resp => resp.text())
      .then(respBody => {
          let respBodyParser = JSON.parse(respBody);
          //if logout success
          if (respBodyParser.success) {
            //update state
            this.setState({ userID: null, userName:''})  
          }                    
      })

  }
  
  showCart() {
    let newArr = JSON.parse(JSON.stringify(this.state.cartUserItems));
    newArr.forEach(element => {
        let arrFiltred = this.state.items.filter(e => e.itemID === element.itemID);
        element.blurb = arrFiltred[0].blurb;
        element.price = arrFiltred[0].price;
        element.image = arrFiltred[0].image;
        element.category = arrFiltred[0].category;
    });
    this.setState({showCart : true, cartUserItemsDetail: newArr});
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
            <label className='username'>{this.state.userName}{this.state.userName !== '' ? (<img  width="20px" height="20px" src={'/Images/Icons/logout.png'} onClick={this.doLogout} />) : (<div></div>)}</label>
            <label>&nbsp;&nbsp;&nbsp;</label>
            <label className='username'><img className='shoppingCart' src={'/Images/Icons/shopping-cart.png'} onClick={this.showCart} />{this.state.cartUserItems.length}</label>            
          </div>
          <div className='wrapper'>
            <div className='aside'>
              <a className='links'>Woman</a>
              <a className='links'>Man</a>
              <a className='links'>Shoes</a>
              <a className='links'>Watches</a>
            </div>
            <RandomItems history={routeProps.history} randomItems={this.state.randomItems} setItemToDetailFunction={this.setItemToDetail}/>
            <div className='asideJoin'>
              <img className='avatar' src={'/Images/Icons/avatar.png'} />
              <button className='regButton'> Sign Up </button>
              <label className='quest'> Already have an account ?</label>
              <button className='regButton' onClick={this.handleLogIn}> Log In </button>
            </div>
            
          </div>
          { this.state.loginClicked ? 
            (<div className='li-modal'>
              <LoginCmp show={this.state.loginClicked} setLoginSuccessFunction={this.setLoginSuccess} />
            </div>) 
            : 
            null
          }
          <ItemDetailCmp item={this.state.item} setItemToCartFunction={this.setItemToCart} />
          {this.state.showCart ? (<PurchaseItemCmp show={this.state.showCart} userID={this.state.userID} userCartItems={this.state.cartUserItems} userCartItemsDetail={this.state.cartUserItemsDetail} />) : null}
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