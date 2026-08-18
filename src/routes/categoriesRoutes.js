const express = require("express");
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory
} = require("../controllers/categoriesController");

const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");
const validate = require("../middleware/validate");
const { idParamSchema } = require("../validators/commonValidators");
const {
  createCategorySchema,
  updateCategorySchema
} = require("../validators/categoryValidators");

const router = express.Router();

// Public browsing routes.
router.get("/", getCategories);
router.get("/:id", validate(idParamSchema, "params"), getCategoryById);

// Admin-only management routes.
router.post(
  "/",
  authenticate,
  authorize("admin"),
  validate(createCategorySchema),
  createCategory
);

router.put(
  "/:id",
  authenticate,
  authorize("admin"),
  validate(idParamSchema, "params"),
  validate(updateCategorySchema),
  updateCategory
);

module.exports = router;
