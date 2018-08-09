import React, { Component } from 'react';
import RandomItems from './RandomItemsCmp'
import { BrowserRouter, Route, Link } from 'react-router-dom'
import styled, { css } from 'styled-components'
import './App.css'
import MainBar from './MainBar'
// logic Components-----------------------------------------------
import SignUpCmp from './SignUpCmp.js';
import LoginCmp from './LoginCmp.js';
import SellerItemCmp from './SellerItemCmp.js';
import PurchaseItemCmp from './PurchaseItemCmp.js';
import ItemDetailCmp from './ItemDetailCmp.js';
import ItemsBoughtCmp from './ItemsBoughtCmp.js';
import AsideJoin from './AsideJoin';
// end -----------------------------------------------------------

class App extends Component {
  constructor() {
    super()
    this.state = {
      items: [],  // this list contains all the items            
      randomItems: [], // this list contains 10 random items from the items list
      categories: ['shoes', 'sunglasses', 'watches', 'technology', 'health', 'home', 'office', 'men', 'women', 'kids'],
      signUpSuccess: false,
      logInSucces: false,
      loginClicked: false,
      userID: null, //this value chang when the login is success
      userName: '',
      item: null,
      cartUserItems: [],
      cartUserItemsDetail: [],
      showCart: false,
      showItemsBought: false,
      showSellerItem: false,
      showItemsSold: false,
      signupClicked: false,
      categorySelected: null
    }
    this.getItems = this.getItems.bind(this)
    this.getRandomItems = this.getRandomItems.bind(this)
    this.renderMain = this.renderMain.bind(this)
    this.renderItem = this.renderItem.bind(this)
    this.setSignUpSuccess = this.setSignUpSuccess.bind(this);
    this.setLoginSuccess = this.setLoginSuccess.bind(this);
    this.handleLogIn = this.handleLogIn.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.doLogout = this.doLogout.bind(this);
    this.setItemToDetail = this.setItemToDetail.bind(this);
    this.setItemToCart = this.setItemToCart.bind(this);
    this.showCart = this.showCart.bind(this);
    this.showItemsBought = this.showItemsBought.bind(this);
    this.showSellerItem = this.showSellerItem.bind(this);
    this.showItemsSold = this.showItemsSold.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);
    this.handleSignUpClose = this.handleSignUpClose.bind(this);
    this.handleItemClose = this.handleItemClose.bind(this);
    this.renderCategories = this.renderCategories.bind(this);
    this.filtredItemsByCategory = this.filtredItemsByCategory.bind(this);
    this.returnRandomItemsComponent = this.returnRandomItemsComponent.bind(this);
    this.handleCloseCart = this.handleCloseCart.bind(this)
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
        let itemList = parsedBody.items;

        if (this.state.categorySelected !== null) {
          let itemsFiltred = itemList.filter(item => item.category === this.state.categorySelected);
          //this.getRandomItems(itemsFiltred); 
          this.setState({ items:itemList, randomItems: itemsFiltred });     
        } else {
          //this.getRandomItems(this.state.items); 
          this.setState({ items:itemList, randomItems: itemList });
        }

        /*if (this.state.categorySelected !== null) {
          let itemsFiltred = this.state.items.filter(item => item.category === this.state.categorySelected);
          //this.getRandomItems(itemsFiltred); 
          this.setState({ randomItems: itemsFiltred });     
        } else {
          //this.getRandomItems(this.state.items); 
          this.setState({ randomItems: this.state.items });
        }*/
        //this.getRandomItems();

        this.setState({ items: parsedBody.items });
      })
    
  }
  /**
   * this function will get ten random items from array of items
   * this items will be store in the state.randomItems
   */

  getRandomItems(itemList) {
    let rItems = [] // this will be the array that will be assigned to state.randomItems
    for (let i = 0; i < 8; i++) {
      let index = Math.floor(Math.random() * itemList.length);
      rItems.push(itemList[index]);
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
    this.setState({ userID: userId, userName: username, logInSucces: success })
  }
  handleLogIn() {
    this.setState({ loginClicked: true })
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

  doLogout() {
    //TODO: REMOVE THE COOKIE!!!
    let bodyInfo = { username: this.state.userName };
    fetch('/logout', {
      method: 'POST',
      body: JSON.stringify(bodyInfo)
    }).then(resp => resp.text())
      .then(respBody => {
        let respBodyParser = JSON.parse(respBody);
        //if logout success
        if (respBodyParser.success) {
          //update state
          this.setState({ userID: null, userName: '', cartUserItems: [], cartUserItemsDetail: [] })
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
    this.setState({ showCart: true, cartUserItemsDetail: newArr });
  }
  handleCloseCart() {
    this.setState({showCart: false})
  }

  showItemsBought() {
    if (!(this.state.cartUserItems.length === 0)) {

      //TODO: erase when end point return info in the component
      let newArr = JSON.parse(JSON.stringify(this.state.cartUserItems));
      newArr.forEach(element => {
        let arrFiltred = this.state.items.filter(e => e.itemID === element.itemID);
        element.blurb = arrFiltred[0].blurb;
        element.price = arrFiltred[0].price;
        element.image = arrFiltred[0].image;
        element.category = arrFiltred[0].category;
      });
      this.setState({ showItemsBought: true, cartUserItemsDetail: newArr });
      //this.setState({ showItemsBought: true});
    }
  }

  showSellerItem() {
    this.setState({ showSellerItem: true });
  }

  showItemsSold() {
    this.setState({ showItemsSold: true });
  }

  handleClose() {
    this.setState({ loginClicked: false })
  }

  handleSignUp() {
    this.setState({ signupClicked: true })
  }

  handleSignUpClose() {
    this.setState({ signupClicked: false })
  }
  handleItemClose() {
    this.setState({ item: null })
  }

  renderCategories() {
    return this.state.categories.map(category => (
      <div onClick={this.filtredItemsByCategory.bind(this, category)}><a className='links' >{category.toUpperCase()}</a></div>
    ));
  }

  filtredItemsByCategory(category) {
    //let itemsFiltred = this.state.items.filter(item => item.category === category);
    //this.setState({items: itemsFiltred});

      let itemsFiltred = this.state.items.filter(item => item.category === category);
      //this.getRandomItems(itemsFiltred);      
      this.setState({ categorySelected: category, randomItems: itemsFiltred});
  }

  returnRandomItemsComponent() {
    return (<RandomItems randomItems={this.state.randomItems} setItemToDetailFunction={this.setItemToDetail} />)
  }

  renderMain(routeProps) {
    return (      
        <div className="App">
          <MainBar 
            userName={this.state.userName}
            doLogout={this.doLogout}
            showCart ={this.showCart}
            cartUserItems = {this.state.cartUserItems}
            showItemsBought = {this.showItemsBought}
            showSellerItem = {this.showSellerItem}
            showItemsSold = {this.showItemsSold}
          />
          <div className='wrapper'>
            <div className='aside'>
              {this.renderCategories()}
            </div>
            {this.returnRandomItemsComponent()}
            <AsideJoin
              handleSignUp={this.handleSignUp}
              handleLogIn={this.handleLogIn}
              signUpSuccess={this.state.signUpSuccess}
              logInSucces={this.state.logInSucces}
            />
          </div>
          {this.state.loginClicked ?
            <LoginCmp show={this.state.loginClicked} setLoginSuccessFunction={this.setLoginSuccess} handleClose={this.handleClose} />
            :
            null
          }
          {!this.state.signUpSuccess ?
            (<SignUpCmp show={this.state.signupClicked} setSignUpSuccessFunction={this.setSignUpSuccess} signUpClose={this.handleSignUpClose} />)
            :
            (<div></div>)
          }
          {this.state.item ?
            <ItemDetailCmp item={this.state.item} setItemToCartFunction={this.setItemToCart} handleItemClose={this.handleItemClose} />
            :
            null
          }
          {this.state.showCart ?
            (<PurchaseItemCmp
              show={this.state.showCart} 
              userID={this.state.userID} 
              userCartItems={this.state.cartUserItems} 
              userCartItemsDetail={this.state.cartUserItemsDetail}
              hanldeCloseCart={() => this.handleCloseCart()} 
              />) 
            : 
            null
          }
          {this.state.showItemsBought ? (<ItemsBoughtCmp show={this.state.showItemsBought} userID={this.state.userID} userCartItems={this.state.cartUserItems} userCartItemsDetail={this.state.cartUserItemsDetail} />) : null}
          {this.state.showSellerItem ? (<SellerItemCmp show={this.state.showSellerItem} userID={this.state.userID} />) : null}
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
