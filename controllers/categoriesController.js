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
            Product.find({ 'category' : req.params.id }, 'name description price inventory')
            .exec(callback);
        }

    }, function(err, results) {

        if (err) { return next(err); }

        if (results.category == null) {
            let err = new Error("Category not found");
            err.status = 404;
            return next(err);
        }

        res.render('category_products', {
            title : results.category.name + " products:",
            description: results.category.description, 
            id: req.params.id, products: results.category_products
        })
    });
}

// Display category create form on GET.
exports.add_category_get = function(req, res, next) {
    res.render('add_category');
}

// Handle category creation on POST from form.
exports.add_category_post = [

    body('name', "Category name is required.")
    .trim()
    .isLength({ min: 1}).escape(),

    body('description', "Category description is required.")
    .trim()
    .isLength({ min: 1 })
    .escape(),

    // Process request after data validation.
    (req, res, next) => {

        let persistant_data = req.body;

        // Extract all validation errors for display.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.render('add_category',
            {
                persistant_data : persistant_data,
                errors : errors.array()
            });
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
exports.delete_category_get = function(req, res, next) {

    async.parallel({
        category : function(callback) {
            Category.findById(req.params.id)
            .exec(callback);
        },

        products : function(callback) {
            Product.find({ 'category' : req.params.id }, 'name')
            .exec(callback);
        }

    },  function(err, result) {

        if (err) { return next(err); }

        if (result.category == null) {
            let err = new Error("Category not found");
            err.status = 404;
            return next(err);
        }

        res.render('delete_category', {
            category_name : result.category.name,
            return_url : "/category/" + result.category._id,
            category_products : result.products
        })

    })
}

// Handle category deletion on POST from form.
exports.delete_category_post = function(req, res, next) {
    async.parallel({
        products : function(callback) {
            Product.deleteMany({ 'category' : req.params.id })
            .exec(callback);
        },

        category : function(callback) {
            Category.deleteOne({ '_id' : req.params.id})
            .exec(callback);
        }
    }, function(err, results) {

        if (err) { return next(err); }
        res.redirect("/");
    })
}

// Display category update / edit form on GET.
exports.update_category_get = function(req, res, next) {

    Category.findById(req.params.id)
    .exec( 
        function(err, results) {
            if (err) { return next(err); }

            // Successful, render.
            res.render('update_category', {
                category_name : results.name,
                category_description : results.description,
                return_url : results.url
            });
        }
    )
}

exports.update_category_post = [

    body('name', 'Product name must be at least 3 characters in length.')
    .trim()
    .isLength({ min: 3})
    .escape(),

    body('description', 'There must be a description')
    .trim()
    .isLength({ min: 1 })
    .escape(),

    (req, res, next) => {

        const errors = validationResult(req);

        async.parallel({
            category : function(callback) {
                Category.findById(req.params.id)
                .exec(callback);
            }
        },
        
        function(err, results) {

            if (err) { next(err); }

            // If there are errors present, re-render update_category with errors listed and persistant data.
            if(!errors.isEmpty()) {
                res.render('update_category', {
                    category_name : results.name,
                    category_description : results.description,
                    return_url : results.url,
                    persistant_data : req.body,
                    errors : errors.array()
                })
            }

            // If no errors, update the category and associated products!
            else {

                Category.findByIdAndUpdate(req.params.id, 
                    {
                        'name' : req.body.name,
                        'description' : req.body.description
                    },

                    function(err, result) {
                        res.redirect(result.url);
                    }
                );
            };
        });
    }
]