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
router.get("/:id/delete_category", categories_controller.delete_category_get);

// POST request for deleting a category.
router.post("/:id/delete_category", categories_controller.delete_category_post);

// GET request for updating a category.
router.get("/:id/update_category", categories_controller.update_category_get);

// POST request for updating a category.
router.post("/:id/update_category", categories_controller.update_category_post);

// GET request for all products of selected category.
router.get("/:id", categories_controller.category_products);


module.exports = router;