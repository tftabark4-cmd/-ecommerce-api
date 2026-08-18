const { logSecurityEvent } = require("../utils/securityLogger");

// Usage: authorize("admin") or authorize("admin", "customer")
function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      // Should never happen if authenticate() runs first, but guard anyway.
      return res.status(401).json({
        success: false,
        message: "Authentication token is required"
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      logSecurityEvent("ACCESS_DENIED", {
        userId: req.user.id,
        role: req.user.role,
        route: req.originalUrl,
        method: req.method
      });
      return res.status(403).json({
        success: false,
        message: "You do not have permission to perform this action"
      });
    }

    next();
  };
}

module.exports = authorize;
