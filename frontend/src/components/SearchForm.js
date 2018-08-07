import React, { Component } from 'react'
import styled from 'styled-components'
import InputBox from './InputBox'
import SearchB from './SearchB'

const SearchF = styled.form`
    display: flex;
`;

class SearchForm extends Component {
    render () {
        return (
          <SearchF>
            <InputBox />
            <SearchB />
          </SearchF>
        )
    }
}

export default SearchForm;