let async = require('async');

const { body, validationResult } = require('express-validator');

let Category = require('../models/categories');


// Display list of all grocery categories for the main page.
exports.categories_list = function(req, res, next) {

    Category.find({}, 'name')
    .sort([["name", "ascending"]])
    .exec(function (err, list_categories) {
        if (err) { return next(err); }

        // Successful, render.
        res.render('categories_view', { list_categories : list_categories});
    })
}


// Display all products in selected category.
exports.category_products = function(req, res, next) {
    let title = req.params.category;
    res.render('category_products', { title: title + " Products: "});
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
