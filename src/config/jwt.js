const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

if (!JWT_SECRET) {
  // Fail fast: never run with a missing/guessable secret.
  throw new Error("JWT_SECRET is not set. Please define it in your .env file.");
}

module.exports = { JWT_SECRET, JWT_EXPIRES_IN };
