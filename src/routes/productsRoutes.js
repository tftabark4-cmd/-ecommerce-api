const express = require("express");
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deactivateProduct
} = require("../controllers/productsController");

const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");
const validate = require("../middleware/validate");
const { idParamSchema } = require("../validators/commonValidators");
const {
  createProductSchema,
  updateProductSchema
} = require("../validators/productValidators");

const router = express.Router();

// Public browsing routes.
router.get("/", getProducts);
router.get("/:id", validate(idParamSchema, "params"), getProductById);

// Admin-only management routes.
router.post(
  "/",
  authenticate,
  authorize("admin"),
  validate(createProductSchema),
  createProduct
);

router.put(
  "/:id",
  authenticate,
  authorize("admin"),
  validate(idParamSchema, "params"),
  validate(updateProductSchema),
  updateProduct
);

router.patch(
  "/:id/deactivate",
  authenticate,
  authorize("admin"),
  validate(idParamSchema, "params"),
  deactivateProduct
);

module.exports = router;
