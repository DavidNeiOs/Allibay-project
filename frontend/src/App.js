import React, { Component } from 'react';
import logo from './logo.svg'
import './App.css';
const assert = require('assert')
let itemsBought = {}

class App extends Component {
  constructor () {
    super()
    
  }
  

   // map that keeps track of all the items a user has bought

  /*
  Use this function to generate a new UID every time a user creates an account.
  
  genUID () {
    return Math.floor(Math.random() * 100000000)
  }

  putItemsBought (userID, value) {
    itemsBought[userID] = value
  }

  getItemsBought (userID) {
    var ret = itemsBought[userID]
    if (ret === undefined) {
      return null
    }
    return ret
  }

  /*
  initializeUserIfNeeded adds the UID to our database unless it's already there
  parameter: [uid] the UID of the user.
  returns: undefined
  
  initializeUserIfNeeded (uid) {
    let items = getItemsBought[uid]
    if (items === null) {
      putItemsBought(uid, [])
    }
  }

  /*
  allItemsBought returns the IDs of all the items bought by a buyer
    parameter: [buyerID] The ID of the buyer
    returns: an array of listing IDs
  
  allItemsBought (buyerID) {
    return itemsBought[buyerID]
  }

  /*
  createListing adds a new listing to our global state.
  This function is incomplete. You need to complete it.
    parameters:
      [sellerID] The ID of the seller
      [price] The price of the item
      [blurb] A blurb describing the item
    returns: The ID of the new listing
  
  createListing (sellerID, price, blurb) {

  }

  /*
  getItemDescription returns the description of a listing
    parameter: [listingID] The ID of the listing
    returns: An object containing the price and blurb properties.
  
  getItemDescription (listingID) {

  }

  /*
  buy changes the global state.
  Another buyer will not be able to purchase that listing
  The listing will no longer appear in search results
  The buyer will see the listing in his history of purchases
  The seller will see the listing in his history of items sold
    parameters:
     [buyerID] The ID of buyer
     [sellerID] The ID of seller
     [listingID] The ID of listing
    returns: undefined
  
  buy (buyerID, sellerID, listingID) {

  }

  /*
  allItemsSold returns the IDs of all the items sold by a seller
    parameter: [sellerID] The ID of the seller
    returns: an array of listing IDs
  
  allItemsSold (sellerID) {

  }

  /*
  allListings returns the IDs of all the listings currently on the market
  Once an item is sold, it will not be returned by allListings
    returns: an array of listing IDs
  
  allListings () {

  }

  /*
  searchForListings returns the IDs of all the listings currently on the market
  Once an item is sold, it will not be returned by searchForListings
    parameter: [searchTerm] The search string matching listing descriptions
    returns: an array of listing IDs
  
  searchForListings (searchTerm) {

  }
  */
  render() {
    return (
       <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
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
