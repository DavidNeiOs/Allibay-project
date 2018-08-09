import React, { Component} from 'react'
import './App.css'

class AsideC extends Component {
    render () {
        return (
            <div className='aside'>
              {this.props.renderCategories()}
            </div>
        );
    }
}

export default AsideC;