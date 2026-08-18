const express = require("express");
const {
  getUsers,
  getUserById,
  createUser,
  updateUserStatus,
  updateUserRole
} = require("../controllers/usersController");

const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");
const validate = require("../middleware/validate");
const { idParamSchema } = require("../validators/commonValidators");
const {
  adminCreateUserSchema,
  updateStatusSchema,
  updateRoleSchema
} = require("../validators/userValidators");

const router = express.Router();

// All user routes require a valid token; specific routes further
// restrict by role or ownership inside the controller (IDOR guard).
router.get("/", authenticate, authorize("admin"), getUsers);

router.get(
  "/:id",
  authenticate,
  validate(idParamSchema, "params"),
  getUserById
);

router.post(
  "/",
  authenticate,
  authorize("admin"),
  validate(adminCreateUserSchema),
  createUser
);

router.patch(
  "/:id/status",
  authenticate,
  authorize("admin"),
  validate(idParamSchema, "params"),
  validate(updateStatusSchema),
  updateUserStatus
);

router.patch(
  "/:id/role",
  authenticate,
  authorize("admin"),
  validate(idParamSchema, "params"),
  validate(updateRoleSchema),
  updateUserRole
);

module.exports = router;
