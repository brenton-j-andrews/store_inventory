// Routing list for category pages.

let express = require('express');
let router = express.Router();

// Controller modules.
let categories_controller = require('../controllers/categoriesController');
let products_controller = require('../controllers/productsController');


// GET categories home page.
router.get("/", categories_controller.categories_list);

// GET request for creating a new category.
router.get("/add_category", categories_controller.add_category_get);

// POST request for submitting new category form.
router.post("/add_category", categories_controller.add_category_post);

// GET request for deleting a category.
router.get("/delete_category", categories_controller.delete_category);

// GET request for all products of selected category.
router.get("/:id", categories_controller.category_products);


module.exports = router;