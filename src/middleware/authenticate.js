const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/jwt");
const { logSecurityEvent } = require("../utils/securityLogger");

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({
      success: false,
      message: "Authentication token is required"
    });
  }

  try {
    // Token payload intentionally holds only non-sensitive identifiers.
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch (error) {
    logSecurityEvent("INVALID_TOKEN_ATTEMPT", {
      route: req.originalUrl,
      method: req.method,
      ip: req.ip
    });
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
}

module.exports = authenticate;
