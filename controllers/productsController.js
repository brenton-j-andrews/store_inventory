let async = require('async');
let mongoose = require('mongoose');

const { body, validationResult } = require('express-validator');

let Category = require('../models/categories');
let Product = require("../models/product");
const product = require('../models/product');


// Display unique product page on GET.
exports.display_product = function(req, res, next) {
  
    Product.findById(req.params.id)
    .populate("category")
    .exec(function (err, result) {
        if (err) { next(err); }

        if (result == null) {
            let err = new Error("Product not found, check database.");
            err.statusCode = 404;
            return next(err);
        }

        res.render("product_view", {
            title: "Product details: " + result.name,
            product_info : result
        });
    })
}

// Display product create form on GET.
exports.add_product_get = function(req, res, next) {

    async.parallel(
        {
            category : function(callback) {
                Category.findById(req.params.id)
                .populate("name")
                .exec(callback);
            },
            categories_list: function(callback) {
                Category.find().exec(callback);
            },
        },

        function (err, result) {
            if (err) { next(err); }
            
            if (result == null) {
                let err = new Error("Category not found, check that it hasn't been edited or deleted.");
                err.statusCode = 404;
                return next(err);
            }


            res.render("add_product", {
                update_bool : false,
                title: "Add product to " + result.category.name + " category, or choose a difference category below:",
                url: result.category.url,
                category_name : result.category.name,
                categories_list : result.categories_list
            });
        }
    )
}

// Handle product creation on POST from form.
exports.add_product_post = [

    body('name', 'Product name must be at least 3 characters in length.')
    .trim()
    .isLength({ min: 3})
    .escape(),

    body('description', 'There must be a description')
    .trim()
    .isLength({ min: 1 })
    .escape(),

    body('price', "Price must be between $0 and $9999")
    .isFloat({ force_decimal: true, min: 0, max: 9999 }),

    body('inventory', "Inventory must be between 0 and 1000")
    .isInt({ min: 0, max: 1000}),


    // Process request after data validation.
    (req, res, next) => {

        // Extract all validation errors for display.
        const errors = validationResult(req);

        let product = new Product({
            name : req.body.name,
            description : req.body.description,
            category: req.body.category,
            price: req.body.price,
            inventory: req.body.inventory
        });

        // If errors are present, re-render 'add_product' as done in add_products function above.
        if (!errors.isEmpty()) {

            async.parallel(
                {
                    category : function(callback) {
                        Category.findById(req.params.id)
                        .populate("name")
                        .exec(callback);
                    },
                    categories_list: function(callback) {
                        Category.find().exec(callback);
                    },
                },
        
                function (err, result) {
                    if (err) { next(err); }
                    console.log(req.body);
                    
                    res.render("add_product", {
                        update_bool : false,
                        title: "Add product to " + result.category.name + " category, or choose a difference category below:",
                        url: result.category.url,
                        category_name : result.category.name,
                        categories_list : result.categories_list,
                        persistant_data : req.body,
                        errors : errors.array()
                    });
                })
            return;
        } 
        
        else {
            product.save(function(err) {
                if (err) return next(err);
                res.redirect("/category/" + req.params.id);
            });
        }
    },
]

// Display delete product form on GET.
exports.delete_product_get = function(req, res, next) {
    
    Product.findById(req.params.id)
    .populate("category")
    .exec(function (err, result) {
        if (err) { next(err); }

        if (result == null) {
            let err = new Error("Product not found, check database.");
            err.statusCode = 404;
            return next(err);
        }

   
        res.render("delete_product", {
            title: "Delete Product: " + result.name,
            url: req.params.id
        });
    })
}

// Handle product deletion on POST from delete_product view.
exports.delete_product_post = function(req, res, next) {

    Product.deleteOne( { _id: req.params.id }, 
    function(err, res) {
        if (err) return err;    
    });
    res.redirect("/");
}

// Display product update form on GET.
exports.update_product_get = function(req, res, next) {
    async.parallel(

        {
            product: function(callback) {
                Product.findById(req.params.id)
                .populate('category')
                .exec(callback);
            },

            categories_list: function(callback) {
                Category.find()
                .exec(callback);
            },
        },

        function (err, result) {
            if (err) { next(err); }
            
            if (result == null) {
                let err = new Error("Category not found, check that it hasn't been edited or deleted.");
                err.statusCode = 404;
                return next(err);
            }

            res.render("add_product", {
                update_bool : true,
                title: "Update Product Information: " + result.product.name,
                url: result.product.category.url,
                product : result.product,
                categories_list : result.categories_list,
                category_name : result.product.category.name,
                persistant_data : result.product
            });
        }
    )
}

// Handle product update on POST from update_product view.
exports.update_product_post = [

    body('name', 'Product name must be at least 3 characters in length.')
    .trim()
    .isLength({ min: 3})
    .escape(),

    body('description', 'There must be a description')
    .trim()
    .isLength({ min: 1 })
    .escape(),

    body('price', "Price must be between $0 and $9999")
    .isFloat({ force_decimal: true, min: 0, max: 9999 }),

    body('inventory', "Inventory must be between 0 and 1000")
    .isInt({ min: 0, max: 1000}),

    (req, res, next) => {

        console.log(req.body.category);
        // Extract all validation errors for display.
        const errors = validationResult(req);

        // If errors are present, re-render 'add_product' with errors.
        if (!errors.isEmpty()) {

            async.parallel(
                {
                    category : function(callback) {
                        Category.findById(req.body.category)
                        .populate("name")
                        .exec(callback);
                    },

                    product: function(callback) {
                        Product.findById(req.params.id)
                        .populate('category')
                        .exec(callback);
                    },
                    categories_list: function(callback) {
                        Category.find().exec(callback);
                    },
                },
        
                function (err, result) {
                    if (err) { next(err); }
                    console.log("HERE: " + result.category.name);
                    console.log(result.category.url);
                    console.log(result.categories_list);
                    
                    res.render("add_product", {
                        update_bool : true,
                        title: "Update Product Information: " + result.product.name,
                        url: result.category.url,
                        product: result.product,
                        category_name : result.category.name,
                        categories_list : result.categories_list,
                        persistant_data : req.body,
                        errors : errors.array()
                    });
                })
            return;
        } 

        else {
            Product.findByIdAndUpdate(
                req.params.id, 

                {
                "name": req.body.name,
                "description": req.body.description,
                "category" : req.body.category,
                "price" : req.body.price,
                "inventory": req.body.inventory
                },
                
                function(err, result) {

                    if (err) {
                        console.log("Error: " + err);
                    } else {
                        console.log("Document updated.");
                        res.redirect(result.url);
                    }
                });
            }
    }

]