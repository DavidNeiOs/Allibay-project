const express = require('express')
const app = express()
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

app.get('/findItemById', (req,res) => {
    let search = req.query.itemID;
    let itemsList = fs.readFileSync('./backend/itemsData.json').toString().split('\n').filter(x => x !== "").map(x => JSON.parse(x));
    let filteredItems = itemsList.filter(itemObj => itemObj.itemId == search)
    if (filteredItems.length>0) {
        let respFiltItem = JSON.stringify({success:true,itemFound:filteredItems[0]})
        res.send(respFiltItem)
    } else {
        let respFailFiltItem = JSON.stringify({success:false,reason:"invalid item id"})
        res.send(respFailFiltItem)
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

app.listen(4000, () => console.log('Listening on port 4000!'))
