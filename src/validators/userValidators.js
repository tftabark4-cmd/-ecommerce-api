const { z } = require("zod");

const adminCreateUserSchema = z.object({
  full_name: z.string().trim().min(2, "Full name must be at least 2 characters").max(150),
  email: z.string().trim().email("Invalid email address").max(255),
  phone: z.string().trim().max(20).optional().nullable(),
  password: z.string().min(8, "Password must be at least 8 characters").max(72),
  role: z
    .enum(["customer", "admin"], {
      errorMap: () => ({ message: "role must be either 'customer' or 'admin'" })
    })
    .optional()
});

const updateStatusSchema = z.object({
  is_active: z.boolean({ invalid_type_error: "is_active must be true or false" })
});

const updateRoleSchema = z.object({
  role: z.enum(["customer", "admin"], {
    errorMap: () => ({ message: "role must be either 'customer' or 'admin'" })
  })
});

module.exports = { adminCreateUserSchema, updateStatusSchema, updateRoleSchema };
