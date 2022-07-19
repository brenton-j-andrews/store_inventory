// Routing list for the entire website.

let express = require('express');
let router = express.Router();

// Controller modules.
let categories_controller = require('../controllers/categoriesController');
let products_controller = require('../controllers/productsController');


// CATEGORY ROUTES //

// GET categories home page.
router.get("/", categories_controller.categories_list);

// GET request for creating a new category.
router.get("/add_category", categories_controller.add_category);

// POST request for submitting new category form.
router.post("/add_category", categories_controller.create_category);

// GET request for deleting a category.
router.get("/delete_category", categories_controller.delete_category);


// PRODUCT ROUTES //

// GET request for all products of selected category.
router.get("/:id", categories_controller.category_products);

// GET product page.
router.get("/product/:id", products_controller.display_product);

// GET request for creating new product under selected category.
router.get("/:id/add", products_controller.add_product);

// POST request for submitting new product form.
router.post("/:id/add", products_controller.create_product);

// GET request for deleting selected product.
router.get("/:id/delete_product", products_controller.delete_product);

module.exports = router;