import React, { Component } from 'react';
import styled from 'styled-components';

import Item from './components/Item'
import Button from './components/Button'

//starts css ---------------------------------------------
const RItems = styled.div`
  margin-top: 7vh;
  margin-left: 0.5vw;
  max-width: 70vw;
  width: 70vw;
  text-align: center;
  background-color: #f2f2f2;
  display: flex;
  flex-wrap: wrap;
`;
// ends css ---------------------------------------------

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
      <RItems>
        {this.props.randomItems.map(item => {
          return (
            <Item> 
              <div>{item.description}</div>
              <Button onClick={(evt) => {
                this.buttonHandler(item.itemID, evt)
              }}>
                See Item
              </Button>
            </Item>
            )
          })} 
      </RItems>
    );
  }
}

export default RandomItems