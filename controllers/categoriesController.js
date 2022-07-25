let async = require('async');
let mongoose = require('mongoose');

const { body, validationResult } = require('express-validator');

let Category = require('../models/categories');
let Product = require("../models/product");


// Display list of all grocery categories for the main page.
exports.categories_list = function(req, res, next) {

    Category.find({}, 'name description')
    .sort([["name", "ascending"]])
    .exec(function (err, list_categories) {
        if (err) { return next(err); }

        // Successful, render.
        res.render('categories_view', { list_categories : list_categories});
    })
}


// Display details of selected category.
exports.category_products = function(req, res, next) {

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

        res.render('category_products', {title : results.category.name + " products:", id: req.params.id, products: results.category_products})
    });
}


// Display category create form on GET.
exports.add_category = function(req, res, next) {
    res.render('add_category');
}


// Handle category creation on POST from form.
exports.create_category = [

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
            res.render('add_category', {errors : errors.array()} );
            return;
        }

        let category = new Category({
            name : req.body.name,
            description : req.body.description
        });

        category.save(function(err) {
            if (err) { return next(err); }
            res.redirect(category.url);
        })
    }
]


// Display category deletion page on GET.
exports.delete_category = function(req, res, next) {
    res.render('delete_product');
}
