let async = require('async');
let mongoose = require('mongoose');

const { body, validationResult } = require('express-validator');

let Category = require('../models/categories');
let Product = require("../models/product");


// Display product create form on GET.
exports.add_product = function(req, res, next) {
    res.render('add_product');
}

// Handle product creation on POST from form.
exports.create_product = [

    body('name').trim().isLength({ min: 1}).escape().withMessage("Category name is required.")
        .isAlphanumeric('en-US', {ignore: " "}).withMessage('Category name has non-alphanumeric characters.'),

    body('description').trim().isLength({ min: 1 }).escape().withMessage('Category description must be specified.')
        .isAlphanumeric('en-US', {ignore: " "}).withMessage('Category description has non-alphanumeric characters.'),


    // Process request after data validation.
    (req, res, next) => {

        // Extract all validation errors for display.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            console.log("you have errors dude!");
            res.render('add_product', {errors : errors.array()} );
            return;
        }

        let product = new Product({
            name : req.body.name,
            description : req.body.description,
            category: req.params.id,
            price: req.body.price,
            inventory: req.body.count
        });

        product.save(function(err) {
            if (err) { return next(err); }
            res.redirect("/categories/" + req.params.id);
        })
    }
]
