#! /usr/bin/env node

// TO EXECUTE, USE THE SCRIPT BELOW:
// node populateProducts 'mongodb+srv://brenton-andrews:db_pass02@cluster0.2u5felz.mongodb.net/Inventory?retryWrites=true&w=majority';

// Get arguments passed on command line
var userArgs = process.argv.slice(2);

/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/

var async = require('async')
var Product = require('../models/product')


var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var products_list = []

function productCreate(name, description, cb) {
    
    let product = new Product({name: name, description: description});
    console.log(product);

    product.save(function(err) {
        if (err) {
            cb(err, null);
            return;
        }

        products_list.push(product);
        cb(null, product);
    })
}


function createProducts(cb) {
    async.series([
        function(callback) {
            productCreate('Dairy', 'Food products produced from milk. Includes cheese, yogurt, butter and icecream', callback);
        },

        function(callback) {
            productCreate('Produce', 'Fresh farm produced fruits and vegetables', callback);
        },

        function(callback) {
            productCreate('Meat', 'Beef, Pork, Seafood and other animal products', callback);
        }
    ])
}


async.series([
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