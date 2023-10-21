const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const routes = require('./app/routes/products.routes');

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://arpitcool544:pLtrvFyKxb5Fx4ff@cluster0.rdmdyph.mongodb.net/Marketplace?retryWrites=true&w=majority',
{useNewUrlParser:true});

const connection = mongoose.connection;

connection.once('open',()=>{
    console.log("DB connected......");
})

app.use(routes);
app.listen(8081,()=>{
    console.log("Server is running on 8081....");
});