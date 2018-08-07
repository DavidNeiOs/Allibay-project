// const alibay = require('/alibay')
const express = require('express')
const app = express()

let serverState = {
    items: [{description: 'pencil', price: 500, itemID: 1},
        {description: 'pen', price: 800, itemID: 2},
        {description: 'car', price: 800, itemID: 3},
        {description: 'dog', price: 700, itemID: 4},
        {description: 'cat', price: 600, itemID: 5},
        {description: 'dog1', price: 800, itemID: 6},
        {description: 'dog2', price: 800, itemID: 7},
        {description: 'dog3', price: 800, itemID: 8},
        {description: 'dog4', price: 800, itemID: 9},    
        {description: 'dog5', price: 800, itemID: 10},
        {description: 'dog6', price: 800, itemID: 11},
        {description: 'dog7', price: 800, itemID: 12}
    ]
}

app.get('/itemsBought', (req, res) => {
    let uid = req.query.uid;
    res.send(JSON.stringify(alibay.getItemsBought(uid)));
});

app.get('/getAllItems', (req, res) => {
    res.send(JSON.stringify({items: serverState.items, ans: 'success'}))
})

app.listen(4000, () => console.log('Listening on port 4000!'))
