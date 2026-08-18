// Wraps a Zod schema and validates req.body (or req.params) against it.
// On failure, returns a unified 400 response listing every invalid field.
function validate(schema, source = "body") {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join(".") || source,
        message: issue.message
      }));

      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors
      });
    }

    // Replace with parsed/coerced data so controllers get clean types.
    req[source] = result.data;
    next();
  };
}

module.exports = validate;
