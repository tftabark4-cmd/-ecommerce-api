const { z } = require("zod");
const { requiredString } = require("./commonValidators");

const registerSchema = z.object({
  full_name: requiredString({ min: 2, max: 150, requiredMessage: "Full name must be at least 2 characters" }),
  email: requiredString({ min: 3, max: 255, requiredMessage: "Invalid email address" }).pipe(
    z.string().email("Invalid email address")
  ),
  phone: z.string().trim().max(20).optional().nullable(),
  password: requiredString({ min: 8, max: 72, requiredMessage: "Password must be at least 8 characters" })
  // role is intentionally NOT accepted from the client on register.
  // New accounts are always created as "customer"; promoting to admin
  // must be done separately by an existing admin.
});

const loginSchema = z.object({
  email: requiredString({ min: 3, max: 255, requiredMessage: "Invalid email address" }).pipe(
    z.string().email("Invalid email address")
  ),
  password: requiredString({ min: 1, max: 72, requiredMessage: "Password is required" })
});

module.exports = { registerSchema, loginSchema };
