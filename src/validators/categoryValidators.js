const { z } = require("zod");
const { requiredString } = require("./commonValidators");

const createCategorySchema = z.object({
  name: requiredString({ min: 1, max: 100, requiredMessage: "Category name is required" }),
  description: z.string().trim().max(1000).optional().nullable()
});

const updateCategorySchema = z.object({
  name: requiredString({ min: 1, max: 100, requiredMessage: "Category name is required" }),
  description: z.string().trim().max(1000).optional().nullable()
});

module.exports = { createCategorySchema, updateCategorySchema };
