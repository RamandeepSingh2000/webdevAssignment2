const express = require('express');
const router = express.Router();
const productModel = require('../models/products.model');
const categoryModel = require('../models/categories.model');

router.route('/').get((req, res) => {
    res.status(200).json({"message": "Welcome to products application."});
});

router.route('/api/products').get((req, res) => {

    if(req.query.name)
    {
        const nameRegex = new RegExp(req.query.name, 'i');
        productModel.find({name: nameRegex})
        .then(products => res.status(200).json(products))
        .catch(err => res.status(400).json({"Error": err}));
        return;
    }

    productModel.find()
    .then(products => res.status(200).json(products))
    .catch(err => res.status(400).json({"Error": err}));
});

router.route('/api/products/:id').get((req, res) => {
    productModel.findById(req.params.id)
    .then(product => res.status(200).json(product))
    .catch(err => res.status(400).json({"Error": err}));
});

router.route('/api/products').post(async(req, res) => {
    let isCorrect = await isCorrectCategory(req.body.category);
    if(!isCorrect)
    {
        res.status(400).json({"Error": "Wrong Category."});
        return;
    }    
    
    let product = new productModel(req.body);
    product.save()
    .then(product => res.status(200).json(product))
    .catch(err => res.status(400).json({"Error": err}));
});

router.route('/api/products/:id').put(async(req, res) => {
    let isCorrect = await isCorrectCategory(req.body.category);
    if(!isCorrect)
    {
        res.status(400).json({"Error": "Wrong Category."});
        return;
    }   

    productModel.findById(req.params.id)
    .then(product => {
        product.name = req.body.name;
        product.description = req.body.description;
        product.price = req.body.price;
        product.quantity = req.body.quantity;
        product.category = req.body.category;

        product.save()
        .then(product => res.status(200).json(product))
        .catch(err => res.status(400).json({"Error": err}));
    })
    .catch(err => res.status(400).json({"Error": err}));
});

router.route('/api/products/:id').delete((req, res) => {
    productModel.findById(req.params.id)
    .then(product => {
        product.deleteOne()
        .then(() => res.status(200).send("Deleted Successfully."))
        .catch(err => res.status(400).json({"Error": err}));
    })
    .catch(err => res.status(400).json({"Error": err}));
});

router.route('/api/products').delete(async(req, res) => {
    try{
        let result = await productModel.deleteMany().exec();
        res.status(200).send(`Deleted all ${result.deletedCount} documents Successfully.`);
    }
    catch(err){
        res.status(400).json({"Error": err})
    }
});

async function isCorrectCategory(incomingCategory)
{
    try{
        let categories = await categoryModel.find().exec();
        for (const category of categories) {
            if (category.name === incomingCategory) {
                return true;
            }
        }
        return false;
    }
    catch(err)
    {
        console.log(err);
        return false;
    }
}

module.exports = router;