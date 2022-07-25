// Routing list for product pages.

let express = require('express');
let router = express.Router();

// Controller modules.
let categories_controller = require('../controllers/categoriesController');
let products_controller = require('../controllers/productsController');

// PRODUCT ROUTES //

// GET product page.
router.get("/:id", products_controller.display_product);

// GET request for creating new product under selected category.
router.get("/:id/add", products_controller.add_product);

// POST request for submitting new product form.
router.post("/:id/add", products_controller.create_product);

// GET request for deleting selected product.
router.get("/:id/delete", products_controller.delete_product);

// POST request for deleting selected product.
router.post("/:id/delete", products_controller.delete_selected);

module.exports = router;