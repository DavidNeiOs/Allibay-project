import React, { Component } from 'react';

class SellerItemCmp extends Component {

    constructor() {
        super();
        this.state = {
            categoryArr: [],
            countryArr: [],
            category: '',
            country: '',
            itemName: '',
            itemImage: null,
            itemDetail: '',
            itemPrice: 0,
            itemCantity: 0,
            message: '',
            sellerItem: false,
            preview: false,
            imgBase64: ''
        }
        this.handleInputCountry = this.handleInputCountry.bind(this);
        this.handleInputCategory = this.handleInputCategory.bind(this);
        this.handleInputName = this.handleInputName.bind(this);
        this.handleInputImage = this.handleInputImage.bind(this);
        this.handleInputDetail = this.handleInputDetail.bind(this);
        this.handleInputPrice = this.handleInputPrice.bind(this);
        this.handleInputCantity = this.handleInputCantity.bind(this);
        this.handleSubmitSave = this.handleSubmitSave.bind(this);
        this.handlePreview = this.handlePreview.bind(this);
    }

    componentDidMount() {
        //TODO: call the endpoint with the information
        this.setState({ categoryArr: ['shoes', 'sunglasses', 'watches', 'technology', 'health', 'home', 'office', 'men', 'women', 'kids'], countryArr: ['Canada', 'Colombia', 'Francia'] });
    }

    handleInputCountry(event) {
        event.preventDefault();
        this.setState({ country: event.target.value });
    }

    handleInputCategory(event) {
        event.preventDefault();
        this.setState({ category: event.target.value })
    }

    handleInputName(event) {
        event.preventDefault();
        this.setState({ itemName: event.target.value })
    }

    handleInputImage(event) {
        event.preventDefault();
        let fd = event.target.files[0];
        this.setState({ itemImage: fd })
    }

    handleInputDetail(event) {
        event.preventDefault();
        this.setState({ itemDetail: event.target.value })
    }

    handleInputPrice(event) {
        event.preventDefault();
        this.setState({ itemPrice: event.target.value })
    }

    handleInputCantity(event) {
        event.preventDefault();
        this.setState({ itemCantity: event.target.value })
    }

    handlePreview(event) {
        event.preventDefault();

        if (this.validateInputs()) {

            var base64String = window.btoa(this.state.itemImage);
            var strImage = "data:image/png;base64," + base64String;
            this.setState({ preview: true, imgBase64: strImage, message: '' });
        } else {
            this.setState({ message: 'field validation error' });
        }
    }

    handleSubmitSave(event) {
        event.preventDefault();
        this.setState({ message: 'field validation error' })
        if (this.validateInputs()) {

            let bodyInfo = {
                category: this.state.category,
                itemName: this.state.itemName,
                itemImage: this.state.itemImage,
                itemDetail: this.state.itemDetail,
                itemPrice: this.state.itemPrice,
                itemCantity: this.state.itemCantity
            };
            /*fetch('/sellItem', {
                method: 'POST',
                body: JSON.stringify(bodyInfo)
            }).then(resp => resp.text())
                .then(respBody => {
                    let respBodyParser = JSON.parse(respBody);
    
                    //confirm sucess to app main
                    this.props.setSignUpSuccessFunction(respBodyParser.success);
    
                    //update state and rerender
                    this.setState({ sellerItem: respBodyParser.success, message: respBodyParser.message})
                })*/

            this.props.closeSellItem();

        } else {
            //confirm fail to app main
            //this.props.setSignUpSuccessFunction(false);

            //update state and rerender
            this.setState({ message: 'field validation error' })
        }
    }

    validateInputs() {
        let valCountry = !this.isStringEmpty(this.state.country);
        let valCategory = !this.isStringEmpty(this.state.category);
        let valitemName = !this.isStringEmpty(this.state.itemName);
        let valitemImage = this.state.itemImage === null ? false : true;
        let valitemDetail = !this.isStringEmpty(this.state.itemDetail);
        let valitemPrice = this.state.itemPrice > 0 ? true : false;
        let valitemCantity = this.state.itemCantity > 0 ? true : false;

        if (valCountry && valCategory && valitemName && valitemImage && valitemDetail && valitemPrice && valitemCantity) {
            return true;
        }
        return false;
    }

    isStringEmpty(str) {
        return (str === null || str === undefined || str === "" || str.trim().length === 0);
    }

    //TODO: DO THE CONDITION IF THE USER IS ALREADDY REGISTER OR NOT
    render() {
        return (this.props.show ?
            <div className='bg-modal'>
                <div className='modal-content-sc'>
                    <form onSubmit={this.handleSubmitSave}>
                        <div className="sellerItemContainer">
                            <div>
                                <div>
                                    <div><h4>Sell item:</h4></div>
                                    <div>
                                        <div>
                                            <label>Country:
                                    <select value={this.state.country} onChange={this.handleInputCountry} >
                                                    <option value="">Select a country</option>
                                                    {this.state.countryArr.map(country => (<option value={country}>{country}</option>))}
                                                </select>
                                            </label>
                                        </div>
                                        <div><label>Category:
                                    <select value={this.state.category} onChange={this.handleInputCategory} >
                                                <option value="">Select a category</option>
                                                {this.state.categoryArr.map(category => (<option value={category}>{category}</option>))}
                                            </select>
                                        </label>
                                        </div>
                                        <div><label>Item name:<input type="text" value={this.state.itemName} onChange={this.handleInputName} /></label></div>
                                        <div><label>Item image:
                                    <input type="file" onChange={this.handleInputImage} />
                                            
                                        </label></div>
                                        <div><label>Detail:<textarea value={this.state.itemDetail} onChange={this.handleInputDetail} /></label></div>
                                        <div><label>Price:<input type="number" value={this.state.itemPrice} onChange={this.handleInputPrice} /></label></div>
                                        <div><label>Stock:<input type="number" value={this.state.itemCantity} onChange={this.handleInputCantity} /></label></div>
                                        <div><input type="submit" value="Preview" onClick={this.handlePreview} /></div>
                                        <div>{this.state.message}</div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div>
                                    <div><h4>Preview:</h4></div>
                                    {this.state.preview ? (
                                        <div>
                                            <div>
                                                <label>Country:{this.state.country}</label>
                                            </div>
                                            <div><label>Category:{this.state.category}</label>
                                            </div>
                                            <div><label><b>{this.state.itemName}</b></label></div>
                                            <div><label><img height="50px" width="50px" src="/Images/items/technology/laptopDell.png" /></label></div>
                                            <div><label>Detail:{this.state.itemDetail}</label></div>
                                            <div><label>Price:{this.state.itemPrice}</label></div>
                                            <div><label>Stock:{this.state.itemCantity}</label></div>
                                            <div><input type="submit" value="Send" /></div>
                                        </div>
                                    ) : (<div></div>)}

                                </div>
                            </div>
                        </div>
                    </form>
                </div>

            </div> : null
        )
    }
}

export default SellerItemCmp;