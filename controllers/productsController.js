let async = require('async');
let mongoose = require('mongoose');

const { body, validationResult } = require('express-validator');

let Category = require('../models/categories');
let Product = require("../models/product");


// Display unique product page on GET.
exports.display_product = function(req, res, next) {
  
    Product.findById(req.params.id)
    .populate("category")
    .exec(function (err, result) {
        if (err) { next(err); }

        if (result == null) {
            let err = new Error("Category not found, check database.");
            err.statusCode = 404;
            return next(err);
        }

        console.log(result);
        res.render("product_view", {
            title: "Product details: " + result.name,
            product_info : result
        });
    })
}

// Display product create form on GET.
exports.add_product = function(req, res, next) {
    Category.findById(req.params.id)
    .populate("name")
    .exec(function (err, result) {
        if (err) { next(err) };
        
        if (result == null) {
            let err = new Error("Category not found, check database.");
            err.statusCode = 404;
            return next(err);
        }

        res.render("add_product", {title: "Add product to " + result.name + " category."});
    })
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

// Display delete product form on GET.
exports.delete_product = function(req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        let err = new Error("Invalid ObjectID");
        err.status = 404;
        return next(err);
    }

    async.parallel({
        category: function(callback) {
            Category.findById(req.params.id).exec(callback);
        },

        category_products: function(callback) {
            console.log(req.params.id);
            Product.find({ 'category' : req.params.id }, 'name description price inventory')
            .exec(callback);
        }

    }, function(err, results) {

        console.log(req.params.id);
        if (err) { return next(err); }

        if (results.category == null) {
            let err = new Error("Category not found");
            err.status = 404;
            return next(err);
        }
        console.log(results);
        res.render('delete_product', {title : "Select product to delete from " + results.category.name + " category:", id: req.params.id, products: results.category_products})
    });
}