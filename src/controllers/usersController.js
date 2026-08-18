const bcrypt = require("bcrypt");
const pool = require("../config/database");
const { logSecurityEvent } = require("../utils/securityLogger");

const SALT_ROUNDS = 12;
const PUBLIC_USER_FIELDS = "id, full_name, email, phone, role, is_active, created_at";

// Admin-only: list all users.
async function getUsers(req, res, next) {
  try {
    const result = await pool.query(`
      SELECT ${PUBLIC_USER_FIELDS}
      FROM users
      ORDER BY id DESC
    `);
    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    next(error);
  }
}

// A user may fetch their own record; an admin may fetch anyone's.
// This is the IDOR guard: ownership is checked against req.user.id,
// never trusted purely because a valid token was presented.
async function getUserById(req, res, next) {
  try {
    const userId = req.params.id; // already validated & coerced by validate()

    if (req.user.role !== "admin" && Number(req.user.id) !== Number(userId)) {
      // Same 404 whether the record doesn't exist or belongs to someone
      // else, so we don't confirm/deny the existence of other accounts.
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const result = await pool.query(
      `SELECT ${PUBLIC_USER_FIELDS} FROM users WHERE id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
}

// Admin-only: create a user account directly (e.g. staff/admin accounts).
// Password is always hashed server-side; the client only ever sends a
// plaintext password, never a hash.
async function createUser(req, res, next) {
  try {
    const { full_name, email, phone, password, role } = req.body;

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const result = await pool.query(
      `INSERT INTO users (full_name, email, phone, password_hash, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING ${PUBLIC_USER_FIELDS}`,
      [full_name, email, phone || null, passwordHash, role || "customer"]
    );

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: result.rows[0]
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

// Admin-only: activate/deactivate an account.
async function updateUserStatus(req, res, next) {
  try {
    const userId = req.params.id;
    const { is_active } = req.body;

    const result = await pool.query(
      `UPDATE users
       SET is_active = $1
       WHERE id = $2
       RETURNING ${PUBLIC_USER_FIELDS}`,
      [is_active, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    logSecurityEvent("USER_STATUS_CHANGED", {
      targetUserId: result.rows[0].id,
      newStatus: is_active,
      byUserId: req.user.id
    });

    res.status(200).json({
      success: true,
      message: "User status updated successfully",
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
}

// Admin-only: change a user's role.
async function updateUserRole(req, res, next) {
  try {
    const userId = req.params.id;
    const { role } = req.body;

    const result = await pool.query(
      `UPDATE users
       SET role = $1
       WHERE id = $2
       RETURNING ${PUBLIC_USER_FIELDS}`,
      [role, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    logSecurityEvent("USER_ROLE_CHANGED", {
      targetUserId: result.rows[0].id,
      newRole: role,
      byUserId: req.user.id
    });

    res.status(200).json({
      success: true,
      message: "User role updated successfully",
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUserStatus,
  updateUserRole
};
