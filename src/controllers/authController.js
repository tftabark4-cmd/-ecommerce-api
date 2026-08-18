const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/database");
const { JWT_SECRET, JWT_EXPIRES_IN } = require("../config/jwt");
const { logSecurityEvent } = require("../utils/securityLogger");

const SALT_ROUNDS = 12;

// Fields that must NEVER be sent back to the client under any circumstance.
const PUBLIC_USER_FIELDS = "id, full_name, email, phone, role, is_active, created_at";

function signToken(user) {
  // Only non-sensitive identifiers go into the token payload.
  return jwt.sign({ sub: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  });
}

async function register(req, res, next) {
  try {
    const { full_name, email, phone, password } = req.body;

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const result = await pool.query(
      `INSERT INTO users (full_name, email, phone, password_hash, role)
       VALUES ($1, $2, $3, $4, 'customer')
       RETURNING ${PUBLIC_USER_FIELDS}`,
      [full_name, email, phone || null, passwordHash]
    );

    const user = result.rows[0];
    const token = signToken(user);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: { user, token }
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "Email already exists"
      });
    }
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      `SELECT id, full_name, email, phone, role, is_active, password_hash
       FROM users WHERE email = $1`,
      [email]
    );

    // Same generic message whether the email doesn't exist or the
    // password is wrong -- never reveal which one was incorrect.
    const genericInvalid = () => {
      logSecurityEvent("LOGIN_FAILED", { email, ip: req.ip });
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    };

    if (result.rows.length === 0) {
      return genericInvalid();
    }

    const user = result.rows[0];

    if (!user.is_active) {
      logSecurityEvent("LOGIN_BLOCKED_INACTIVE", { userId: user.id, ip: req.ip });
      return res.status(401).json({
        success: false,
        message: "This account has been deactivated"
      });
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return genericInvalid();
    }

    delete user.password_hash;
    const token = signToken(user);
    logSecurityEvent("LOGIN_SUCCESS", { userId: user.id, ip: req.ip });

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: { user, token }
    });
  } catch (error) {
    next(error);
  }
}

async function me(req, res, next) {
  try {
    const result = await pool.query(
      `SELECT ${PUBLIC_USER_FIELDS} FROM users WHERE id = $1`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
}

module.exports = { register, login, me };
