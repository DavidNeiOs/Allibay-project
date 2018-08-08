const express = require('express')
const app = express()
const replace = require('replace');
const bodyParser = require('body-parser');
const sha256 = require('sha256');
const fs = require('fs');

app.use(bodyParser.raw({type: '*/*'}))

/*
let itemsDataState = JSON.parse(fs.readFileSync("./itemsData.json").toString().split('\n'));
let usersDataState = JSON.parse(fs.readFileSync("./usersData.json").toString().split('\n'));
let txnDataState = JSON.parse(fs.readFileSync("./txnData.json").toString().split('\n'));
*/

let serverState = {
    items : [],
    users : [],
    txns : [],
    sessions : []
}

/*
app.get('/itemsBought', (req, res) => {
    let uid = req.query.uid;
    //to finish & test tuesday morning
    res.send(JSON.stringify(alibay.getItemsBought(uid)));
});

app.get('/soldItemsHistory', (req,res) => {
    let uid = req.query.uid;
    //to finish & test tuesday morning
    res.send(JSON.stringify(alibay.allItemsSold(uid)))
})

app.get('/findItemById', (req,res) => {
    let itemId = req.query.id;
    //to finish & test tuesday morning
    res.send(JSON.stringify(alibay.getItemDescription(itemId)))
})
*/

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
        let userId = "";
        let userFile = fs.readFileSync("./backend/userData.json").toString();
        if (userFile != null && userFile !== undefined) {
            let newArray = userFile.split('\n');

            newArray.forEach(e => {
                if (e !== undefined && e !== null && e !== "") {
                    let usrObject = JSON.parse(e);
                    if (usrObject.username === loginCredentials.username
                        && usrObject.password === sha256(loginCredentials.password)) {
                            userId = usrObject.userId;
                    }
                }
            })
        }
        let successLoginResp = JSON.stringify({success:true,sessionID:token,userID:userId})
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
        //generate userId
        let userId = Math.floor(Math.random()*100000);
        userCredentials.userId = userId;
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
            let resBody = {success:true,userId:userId};
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
    if (saleData.itemBlurb === "") {
        res.send(JSON.stringify({success:false,reason:"missing description to item"}))
    } else if (saleData.itemPrice === "") {
        res.send(JSON.stringify({success:false,reason:"missing price to item"}))
    } else if (saleData.image === "") {
        res.send(JSON.stringify({success:false,reason:"missing description to item"}))
    } else if (saleData.userId === "") {
        res.send(JSON.stringify({success:false,reason:"missing userId to item"}))
    } else if (saleData.stock === "") {
        res.send(JSON.stringify({success:false,reason:"missing stock to item"}))
    } else if (saleData.state === "") {
        res.send(JSON.stringify({success:false,reason:"missing state to item"}))
    } else if (saleData.category === "") {
        res.send(JSON.stringify({success:false,reason:"missing category to item"}))
    } else {
        let newItem = {
            itemBlurb : saleData.itemBlurb,
            price : saleData.itemPrice,
            picture : saleData.image,
            sellerId : saleData.userId,
            stock : saleData.stock,
            state : saleData.state,
            itemId : Math.floor(Math.random()*100000),
            category : saleData.category,
        }
        
        fs.appendFileSync('./backend/itemsData.json', JSON.stringify(newItem) + '\n')
        //respond
        let saleItemResp = JSON.stringify({success:true,sellerId:newItem.sellerId,itemId:newItem.itemId})
        res.send(saleItemResp);
    }
})


app.post('/purchaseItem', (req,res) => {
    
    let reqBody = JSON.parse(req.body.toString());
    let cartData = reqBody.cart;
    var buyerId = parseInt(reqBody.userId);
    //find username with userId in userData.json
    let buyerData = fs.readFileSync("./backend/userData.json").toString().split('\n').filter(x => x !== "").map(x => JSON.parse(x)).filter(x => x.userId == buyerId);
    //verify if user has a session in serverState
    let sess = serverState.sessions.filter(usr => usr.username === buyerData[0].username);
    if (sess.length > 0) {
        //if yes, 
        //get itemsIds from cartData and append to itemsPurchList
        let itemsPurchLst = cartData.map(x => x.itemId)
        //find if items are available by verifying itemsData.json
        let allItems = fs.readFileSync("./backend/itemsData.json").toString().split('\n').filter(x => x !== "").map(x => JSON.parse(x));
        let allItemsBefore = fs.readFileSync("./backend/itemsData.json").toString().split('\n').filter(x => x !== "").map(x => JSON.parse(x));

        let beforePurchItems = [];
        for (i=0;i<itemsPurchLst.length;i++) {
            let itemFound = allItemsBefore.find(x => x.itemId == itemsPurchLst[i])
            beforePurchItems.push(itemFound);
        }
        let availItems = [];
        for (i=0;i<itemsPurchLst.length;i++) {
            let itemFound = allItems.find(x => x.itemId == itemsPurchLst[i])
            availItems.push(itemFound);
        }
        //if not avail, res.send error items out of stock
        if (availItems.length < 1) {
            res.send(JSON.stringify({success:false,reason:"items were not found or are out of stock"}))
        }
        let boughtItems = []
        
        for (i=0;i<cartData.length;i++) {
            var qty = parseInt(cartData[i].qtyPurchased)
            availItems.forEach(x => {
                if (x.itemId==cartData[i].itemId) {
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

})
app.get('/findItemById', (req,res) => {
    let search = req.query.itemID;
    let itemsList = fs.readFileSync('./backend/itemsData.json').toString().split('\n').filter(x => x !== "").map(x => JSON.parse(x));
    let filteredItems = itemsList.filter(itemObj => itemObj.itemId == search)
    if (filteredItems.length>0) {
        res.send(JSON.stringify({success:true,itemFound:filteredItems[0]}))
    } else {
        res.send(JSON.stringify({success:false,reason:"invalid item id"}))
    }
})

app.get('/getAllItems', (req,res) => {
    try {
        let itemsList = fs.readFileSync('./backend/itemsData.json').toString().split('\n').filter(x => x !== "").map(x => JSON.parse(x));
        res.send(JSON.stringify({success:true,items:itemsList}))
    } catch(err) {
        res.send(JSON.stringify({success:false,items:"error"}))
    }
})

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
<<<<<<< HEAD
        userFile = fs.readFileSync("./backend/userData.json").toString();
=======
        userFile = fs.readFileSync("./userData.txt").toString();
>>>>>>> 755efe2a7d10b986f023d32abf2d5631212ea61e
        if (userFile != null && userFile !== undefined) {
            let newArray = JSON.parse(userFile).split('\n');

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

app.listen(4000, () => console.log('Listening on port 4000!'))
