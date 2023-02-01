const express = require("express");
const mongoose = require("mongoose");
const port = 8000;
const app = express();
const users = require("./model/userSchema");
const books = require("./model/bookSchema");

app.use(express.json());
app.use(express.urlencoded({extended: true}));


mongoose.connect("mongodb+srv://RAONE:O73Rop7jfLtTIgnu@cluster0.7oelggv.mongodb.net/?retryWrites=true&w=majority").then((data, err)=>{
    if(err){
        return console.log("Database connection failed");
    }else{
        console.log("Database connected");
    }
});

app.post('/sign-up', (req, res)=>{
    const payload = req.body;
    users.find({email: payload.email}).then((data, err)=>{
        if(err){
            console.log(err);
            res.send("Sign-up failed");
            return;
        }
        if(data && data.length > 0){
            res.send({msg: "user already exist"});
        }else{
            users.create(payload).then((data, err)=>{
                if(err){
                    console.log(err);
                    res.send({msg: "Sign-up failed"});
                    return;
                }
                res.send({msg: "Sign-up successful"});
            });
        }
        return;
    });
    return;
});


app.post("/login", (req, res)=>{
    const payload = req.body;
    users.find({email: payload.email}).then((data, err)=>{
        if(err){
            res.send({msg: "Login failed"});
            return;
        }
        if(!data || data.length == 0){
            res.send({msg: "login failed"});
            return;
        }

        const retrivedUser = data[0];
        if(payload.password == retrivedUser.password){
            res.send({msg: "Login success", type: retrivedUser.type});
            return;
        }
        res.send({msg: "login failed"});
    });
});


app.post("/books-availability", (req, res)=>{
    const payload = req.body;
    books.findOne({name: payload.name}).then((data, err)=>{
        if(err || !data || data.availability == 0){
            res.send({available: false});
            return;
        }
        res.send({available: true});
    });
});

app.post("/books/add", (req, res)=>{
    const payload = req.body;

    books.findOne({name: payload.name}).then((data, err)=>{
        if(err){
            res.send({msg: "adding failed"});
            return;
        }

        console.log("data: ", data);

        if(!data || data.length == 0){
            books.create({...payload, availability: 1}).then((data, err)=>{
                if(err){
                    res.send({msg: "adding failed"});
                    return;
                }
                res.send({msg: "Book added"});
                return;
            });
            return;
        }

        const updatePayload = {...data._doc, _id: undefined, availability: data.availability + 1}
        console.log("update", updatePayload);
        books.updateOne(updatePayload).then((data, err)=>{
            if(err){
                console.log("errror", err);
                res.send({msg: "Adding failed"});
                return;
            }
            res.send({msg: "book added"});
            

        });
        
    });
    
});

app.post("/books/search", (req, res)=>{
    const payload = req.body;
    books.find(payload).then((data, err)=>{
        if(err || !data || data.length == 0){
            res.send({msg: "Not Found"});
            return;
        }
        res.send({msg: true, books: data});
    });
});


app.get('/health-check', (req, res)=>{
    res.send("running");
});
app.listen(port, (data, err) =>{
    if (err){
        return console.log("error");
    }
    console.log(`Listen to port: ${port}`);
});


//O73Rop7jfLtTIgnu