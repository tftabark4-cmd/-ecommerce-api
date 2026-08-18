const { z } = require("zod");
const { requiredString } = require("./commonValidators");

const createProductSchema = z.object({
  category_id: z.coerce.number().int().positive("category_id must be a positive integer"),
  name: requiredString({ min: 1, max: 200, requiredMessage: "Product name is required" }),
  description: z.string().trim().max(2000).optional().nullable(),
  price: z.coerce.number().positive("Price must be greater than zero"),
  stock_quantity: z.coerce
    .number({ invalid_type_error: "stock_quantity must be a number" })
    .int("stock_quantity must be an integer")
    .min(0, "stock_quantity cannot be negative")
    .optional()
    .default(0),
  sku: requiredString({ min: 1, max: 50, requiredMessage: "SKU is required" })
});

const updateProductSchema = z.object({
  category_id: z.coerce.number().int().positive("category_id must be a positive integer"),
  name: requiredString({ min: 1, max: 200, requiredMessage: "Product name is required" }),
  description: z.string().trim().max(2000).optional().nullable(),
  price: z.coerce.number().positive("Price must be greater than zero"),
  stock_quantity: z.coerce
    .number({ invalid_type_error: "stock_quantity must be a number" })
    .int("stock_quantity must be an integer")
    .min(0, "stock_quantity cannot be negative"),
  sku: requiredString({ min: 1, max: 50, requiredMessage: "SKU is required" }),
  is_active: z.boolean()
});

module.exports = { createProductSchema, updateProductSchema };
