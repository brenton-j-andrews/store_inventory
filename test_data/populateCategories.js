#! /usr/bin/env node

// TO EXECUTE, USE THE SCRIPT BELOW:
// node populateCategories 'mongodb+srv://brenton-andrews:db_pass02@cluster0.2u5felz.mongodb.net/Inventory?retryWrites=true&w=majority';

// Get arguments passed on command line
var userArgs = process.argv.slice(2);

/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/

var async = require('async')

var Category = require('../models/categories')
var Product =  require('../models/product');


var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var categories = [];
var products = [];

function categoryCreate(name, description, cb) {
    
    let category = new Category({name: name, description: description});

    category.save(function(err) {
        if (err) {
            cb(err, null);
            return;
        }

        console.log("New Category: " + category);
        categories.push(category);
        cb(null, category);
    })
}

function productCreate(name, description, category, price, inventory, cb) {
    
    let product = new Product({
        name: name, 
        description: description,
        category: category,
        price: price,
        inventory: inventory
    });

    product.save(function(err) {
        if (err) {
            cb(err, null);
            return;
        }

        console.log("New product: " + product);
        products.push(product);
        cb(null, product);
    }) 
}

function createCategories(cb) {
    async.series([
        function(callback) {
            categoryCreate('Dairy', 'Food products produced from milk. Includes cheese, yogurt, butter and icecream', callback);
        },

        function(callback) {
            categoryCreate('Produce', 'Fresh farm produced fruits and vegetables', callback);
        },

        function(callback) {
            categoryCreate('Meat', 'Beef, Pork, Seafood and other animal products', callback);
        }],
        cb);
}

function createProducts(cb) {
    console.log("am i here?");
    async.series([
        function(callback) {
            productCreate("Milk", "Fresh whole milk!", categories[0], 3.99, 43, callback);
        },

        function(callback) {
            productCreate("Ice Cream", "Delicious vanilla icecream", categories[0], 5.50, 12, callback);
        },

        function(callback) {
            productCreate("Greek Yogurt", "Organic Greek Yogurt", categories[0], 2.99, 21, callback);
        },

        function(callback) {
            productCreate("Honeycrisp Apples", "Organic Honeycrisp Apples", categories[1], 3.49, 71, callback);
        },

        function(callback) {
            productCreate("Bananas", "Ripe banana's!", categories[1], 1.99, 32, callback);
        },

        function(callback) {
            productCreate("Italian Parsley", "A bundle of fresh Italian Parsley", categories[1], .99, 20, callback);
        },

        function(callback) {
            productCreate("Ground Beef", "Perfect for hamburgers!", categories[2], 6.99, 17, callback);
        },

        function(callback) {
            productCreate("Breakfast Sausage", "Breakfast sausage made with our famous spice blend", categories[2], 5.49, 19, callback);
        },

        function(callback) {
            productCreate("Fresh Salmon", "Fresh caught wild salmon from Washington State", categories[2], 10.99, 11, callback);
        },
    ])
}

async.series([
    createCategories,
    createProducts
],

// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('BOOKInstances: '+bookinstances);
        
    }

    // All done, disconnect from database
    mongoose.connection.close();
});