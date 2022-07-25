// Home page router. Combine with categoryRoutes file eventually?

let express = require('express');
let router = express.Router();

// Controller modules.
let categories_controller = require('../controllers/categoriesController');

// GET categories home page.
router.get("/", categories_controller.categories_list);

module.exports = router;