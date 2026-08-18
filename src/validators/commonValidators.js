const { z } = require("zod");

// Coerces the :id route param into a positive integer, or fails validation.
const idParamSchema = z.object({
  id: z.coerce
    .number({ invalid_type_error: "ID must be a number" })
    .int("ID must be an integer")
    .positive("ID must be a positive number")
});

// Helper: a trimmed, required string with a friendly message even when
// the field is completely missing from the request body (not just empty).
function requiredString({ min = 1, max = 255, minMessage, requiredMessage }) {
  return z.preprocess(
    (val) => (val === undefined || val === null ? "" : val),
    z
      .string({ invalid_type_error: requiredMessage || "This field is required" })
      .trim()
      .min(min, minMessage || requiredMessage || "This field is required")
      .max(max)
  );
}

module.exports = { idParamSchema, requiredString };
