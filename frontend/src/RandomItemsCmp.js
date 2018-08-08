import React, { Component } from 'react';
import styled from 'styled-components';
import './App.css'


class RandomItems extends Component {
  constructor(props) {
      super(props)
      this.buttonHandler = this.buttonHandler.bind(this)
  }
  buttonHandler(item, evt) {
    evt.preventDefault();
    //this.props.history.push('/item/' + itemID);
    this.props.setItemToDetailFunction(item.itemID);
  }
  render() {
    return (
      <div className='rItems'>
        {this.props.randomItems.map(item => {
          return (
            <div className='itemC'> 
              <div><img src={"/Images/items/" + item.category+"/"+item.image} height="50px" width="50px" /></div>
              <div>{item.blurb}</div>
              <div>CAD $ {item.price}</div>
              <button className='itemsButton' onClick={(evt) => {
                this.buttonHandler(item, evt)
              }}>
                See Item
              </button>
            </div>
            )
          })} 
      </div>
    );
  }
}

export default RandomItems