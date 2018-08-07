import React, { Component } from 'react';
import styled from 'styled-components';
import './App.css'


class RandomItems extends Component {
  constructor(props) {
      super(props)
      this.buttonHandler = this.buttonHandler.bind(this)
  }
  buttonHandler(itemID, evt) {
    evt.preventDefault();
    this.props.history.push('/item/' + itemID);
  }
  render() {
    return (
      <div className='rItems'>
        {this.props.randomItems.map(item => {
          return (
            <div className='itemC'> 
              <div>{item.description}</div>
              <button className='itemsButton' onClick={(evt) => {
                this.buttonHandler(item.itemID, evt)
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