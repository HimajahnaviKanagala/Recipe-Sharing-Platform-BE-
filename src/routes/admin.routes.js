import express from "express";
import {
  getAllUsers,
  getUserById,
  deleteUser,
  updateUserRole,
  deleteAnyRecipe,
  toggleFeaturedRecipe,
  getStats,
} from "../controllers/admin.controller.js";
import authenticate from "../middleware/auth.middleware.js";
import authorizedRoles from "../middleware/role.middleware.js";

const router = express.Router();

router.get("/users", authenticate, authorizedRoles("ADMIN"), getAllUsers);
router.get("/users/:id", authenticate, authorizedRoles("ADMIN"), getUserById);
router.delete("/users/:id", authenticate, authorizedRoles("ADMIN"), deleteUser);
router.patch(
  "/users/:id/role",
  authenticate,
  authorizedRoles("ADMIN"),
  updateUserRole,
);
router.delete(
  "/recipes/:id",
  authenticate,
  authorizedRoles("ADMIN", "MODERATOR"),
  deleteAnyRecipe,
);
router.patch(
  "/recipes/:id/feature",
  authenticate,
  authorizedRoles("ADMIN"),
  toggleFeaturedRecipe,
);
router.get("/stats", authenticate, authorizedRoles("ADMIN"), getStats);

export default router;
