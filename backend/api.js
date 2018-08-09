const express = require('express')
const app = express()
const replace = require('replace');
const bodyParser = require('body-parser');
const sha256 = require('sha256');
const fs = require('fs');

app.use(bodyParser.raw({type: '*/*'}))

let serverState = {
    items : [],
    users : [],
    txns : [],
    sessions : []
}

app.post('/login', (req,res)=> {
    let loginCredentials = JSON.parse(req.body.toString());
    let username = loginCredentials.username;
    let password = loginCredentials.password;
    // verifiy user login credentials
    if (getUserInfoFromFile(loginCredentials)) {    
        //register session 
        let token = Math.floor(Math.random() * 10000) + "";
        serverState.sessions.push({ username: username, token: token });
        //send cookie and response
        res.cookie('userCookie', token);
        let userID = "";
        let userFile = fs.readFileSync("./backend/userData.json").toString();
        if (userFile != null && userFile !== undefined) {
            let newArray = userFile.split('\n');

            newArray.forEach(e => {
                if (e !== undefined && e !== null && e !== "") {
                    let usrObject = JSON.parse(e);
                    if (usrObject.username === loginCredentials.username
                        && usrObject.password === sha256(loginCredentials.password)) {
                            userID = usrObject.userID;
                    }
                }
            })
        }
        let successLoginResp = JSON.stringify({success:true,sessionID:token,userID:userID})
        res.send(successLoginResp); //true token
    } else {
        let wrongLoginResp = JSON.stringify({success:false,reason:"invalid username or password"})
        res.send(wrongLoginResp);    
    }
    console.log(serverState.sessions)
})

app.post('/signUp', (req,res)=> {
    let userCredentials = JSON.parse(req.body.toString());
    //verify if user already exists 
    if (!getUserInfoFromFile(userCredentials)) {
        //generate userID
        let userID = Math.floor(Math.random()*100000);
        userCredentials.userID = userID;
        //hash user password
        let hashPwd = sha256(userCredentials.password);
        userCredentials.password=hashPwd;
        let contactInfo = userCredentials.contact
        if (contactInfo === null || contactInfo === undefined || contactInfo === "") {
            //check if there is any contact info has been entered
            let noCont = {succes:false,reason:"misssing contact info"};
            res.send(JSON.stringify(noCont));
        } else if (
            //check if there is ALL contact info has been entered
            contactInfo.address === "" || contactInfo.postalcode === "" ||
            contactInfo.phonenumber === "" || contactInfo.email === "" ) {
            let missCont = {succes:false,reason:"please fill out all contact info"};
            res.send(JSON.stringify(missCont));
        } else {
            //if not, add user data to json data file
            fs.appendFileSync('./backend/userData.json', JSON.stringify(userCredentials) + '\n');
            //generate responseBody&send it to frontend
            let resBody = {success:true,userID:userID};
            res.send(JSON.stringify(resBody));
        }
    } else {
        //if yes, send error object
        let errObj = {succes:false,reason:"user already exists"};
        res.send(JSON.stringify(errObj));
    }
})

app.post('/sellItem', (req,res) => {
    let saleData = JSON.parse(req.body.toString());
    //create item object and add data to json data file
    if (saleData.blurb === "") {
        res.send(JSON.stringify({success:false,reason:"missing description to item"}))
    } else if (saleData.price === "") {
        res.send(JSON.stringify({success:false,reason:"missing price to item"}))
    } else if (saleData.image === "") {
        res.send(JSON.stringify({success:false,reason:"missing description to item"}))
    } else if (saleData.userID === "") {
        res.send(JSON.stringify({success:false,reason:"missing userID to item"}))
    } else if (saleData.stock === "") {
        res.send(JSON.stringify({success:false,reason:"missing stock to item"}))
    } else if (saleData.state === "") {
        res.send(JSON.stringify({success:false,reason:"missing state to item"}))
    } else if (saleData.category === "") {
        res.send(JSON.stringify({success:false,reason:"missing category to item"}))
    } else {
        let newItem = {
            blurb : saleData.blurb,
            price : saleData.price,
            picture : saleData.image,
            description : saleData.description,
            sellerID : saleData.userID,
            stock : saleData.stock,
            state : saleData.state,
            itemID : Math.floor(Math.random()*100000),
            category : saleData.category,
        }
        
        fs.appendFileSync('./backend/itemsData.json', JSON.stringify(newItem) + '\n')
        //respond
        let saleItemResp = JSON.stringify({success:true,sellerId:newItem.sellerId,itemID:newItem.itemID})
        res.send(saleItemResp);
    }
})

app.post('/purchaseItem', (req,res) => {
    
    let reqBody = JSON.parse(req.body.toString());
    let cartData = reqBody.cart;
    var buyerId = parseInt(reqBody.userID);
    //find username with userID in userData.json
    let buyerData = fs.readFileSync("./backend/userData.json").toString().split('\n').filter(x => x !== "").map(x => JSON.parse(x)).filter(x => x.userID == buyerId);
    //verify if user has a session in serverState
    let sess = serverState.sessions.filter(usr => usr.username === buyerData[0].username);
    if (sess.length > 0) {
        //if yes, 
        //get itemsIds from cartData and append to itemsPurchList
        let itemsPurchLst = cartData.map(x => x.itemID)
        //find if items are available by verifying itemsData.json
        let allItems = fs.readFileSync("./backend/itemsData.json").toString().split('\n').filter(x => x !== "").map(x => JSON.parse(x));
        let allItemsBefore = fs.readFileSync("./backend/itemsData.json").toString().split('\n').filter(x => x !== "").map(x => JSON.parse(x));

        let beforePurchItems = [];
        for (i=0;i<itemsPurchLst.length;i++) {
            let itemFound = allItemsBefore.find(x => x.itemID == itemsPurchLst[i])
            beforePurchItems.push(itemFound);
        }
        let availItems = [];
        for (i=0;i<itemsPurchLst.length;i++) {
            let itemFound = allItems.find(x => x.itemID == itemsPurchLst[i])
            availItems.push(itemFound);
        }
        //if not avail, res.send error items out of stock
        if (availItems.length < 1) {
            res.send(JSON.stringify({success:false,reason:"items were not found or are out of stock"}))
        }
        let boughtItems = []
        
        for (i=0;i<cartData.length;i++) {
            var qty = parseInt(cartData[i].quantity)
            availItems.forEach(x => {
                if (x.itemID==cartData[i].itemID) {
                    var itmBought = Object.assign({}, x)
                    x.stock = (parseInt(x.stock)-qty).toString()
                    itmBought.stock = qty.toString()
                    boughtItems.push(itmBought)
                }
            })
        }
        let priceTotal = 0;
        for (i=0;i<boughtItems.length;i++) {
            priceTotal = priceTotal + parseInt(boughtItems[i].price)
        }
        console.log(boughtItems,availItems,beforePurchItems)
        //if available, use replace module to change the necessary data in itemsData.json
        //for loop array of objects containing regex & replax , to change itemsData.json
        for (i=0;i<beforePurchItems.length;i++) {
            replace({
                regex: JSON.stringify(beforePurchItems[i]),
                replacement: JSON.stringify(availItems[i]),
                paths: ["./backend/itemsData.json"],
                recursive: true,
                silent: true,
                });
        }
        //create transaction (itemId, sellerId, buyerId, txnTime, price, session, generate buyerId)
        let newTxn = {
            transactionID : Math.floor(Math.random()*100000),
            date : new Date() / 1 ,
            price : priceTotal,
            txnStatus : 0,
            sessionID : sess[0].token,
            items : boughtItems,
            buyerId : buyerId,
        }
        //append txn to txnData.json
        fs.appendFileSync('./backend/txnData.json', JSON.stringify(newTxn) + '\n')
        res.send(JSON.stringify({success:true,transaction:newTxn}))
    } else {
    //if not, send res.send error session timed out
        res.send(JSON.stringify({success:false,reason:"session timed out"}))
    }
})

app.get('/itemsBought', (req,res) => {
    let search = req.query.userID;
    let txnList = fs.readFileSync('./backend/txnData.json').toString().split('\n').filter(x => x !== "").map(x => JSON.parse(x));
    let filteredTxn = txnList.filter(txn => txn.buyerId == search)
    if (filteredTxn.length>0) {
        let lst = filteredTxn.map(x => x.items);
        var merged = [].concat.apply([],lst)
        res.send(JSON.stringify({success:true,items:merged}))
    } else {
        res.send(JSON.stringify({success:false,reason:"invalid buyer id"}))
    }
})

app.get('/findItemById', (req,res) => {
    let search = req.query.itemID;
    let itemsList = fs.readFileSync('./backend/itemsData.json').toString().split('\n').filter(x => x !== "").map(x => JSON.parse(x));
    let filteredItems = itemsList.filter(itemObj => itemObj.itemID == search)
    if (filteredItems.length>0) {
        res.send(JSON.stringify({success:true,itemFound:filteredItems[0]}))
    } else {
        res.send(JSON.stringify({success:false,reason:"invalid item id"}))
    }
})

app.get('/getAllItems', (req,res) => {
        let itemsList = fs.readFileSync('./backend/itemsData.json').toString().split('\n').filter(x => x !== "").map(x => JSON.parse(x));
        res.send(JSON.stringify({success:true,items:itemsList}))
    }
)
app.get('/soldItemsHistory', (req,res) => {
    let search = req.query.userID;
    let itemsList = fs.readFileSync('./backend/itemsData.json').toString().split('\n').filter(x => x !== "").map(x => JSON.parse(x));
    let filteredItems = itemsList.filter(itemObj => itemObj.sellerId == search)
    if (filteredItems.length>0) {
        res.send(JSON.stringify({success:true,itemFound:filteredItems}))
    } else {
        res.send(JSON.stringify({success:false,reason:"invalid seller id"}))
    }
})

app.get('/init', (req, res) => {
    let sessionID = getSessionIdFromCookie(req);
    //verify if is a user has already a valid session
    let ses = serverState.sessions.filter(usr => usr.token === sessionID);
    if (ses.length > 0) {
        res.send(ses[0].nickname); //no require login again
    } else {
        res.send(""); //require login 
    }
});

app.post('/logout', (req,res) => {
    let usrLogOut = JSON.parse(req.body.toString());
    let sess = serverState.sessions.filter(user => user.username !== usrLogOut.username);
    if (sess.length < serverState.sessions.length) {
        serverState.sessions = sess
        console.log(serverState)
        res.send(JSON.stringify({success:true, description:"user logged out"}))
    } else {
        res.send(JSON.stringify({success:false, description:"user logged NOT out"}))
    }
})

function getSessionIdFromCookie(req) {
    let sessionID = req.headers.cookie != undefined ? req.headers.cookie.split("=")[1] : "";
    return sessionID;
}

function getUserInfoFromFile(mesBody) {
    let existUser = false;
    try {
        userFile = fs.readFileSync("./backend/userData.json").toString();
        if (userFile != null && userFile !== undefined) {
            let newArray = userFile.split('\n');

            newArray.forEach(e => {
                if (e !== undefined && e !== null && e !== "") {
                    let usrObject = JSON.parse(e);
                    if (usrObject.username === mesBody.username
                        && usrObject.password === sha256(mesBody.password)) {
                            existUser = true;
                    }
                }
            })
        }
    } catch (err) {
        console.log("Error reading from file");
    }

    return existUser;
}

app.listen(5000, () => console.log('Listening on port 5000!'))
