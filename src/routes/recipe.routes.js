import express from "express";
import {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  getRecipesByUserId,
  getMyRecipes,
  updateRecipe,
  deleteRecipe,
  getCategories,
} from "../controllers/recipe.controller.js";
import authenticate from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getAllRecipes);
router.get("/categories", getCategories);
router.get("/:id", getRecipeById);
router.get("/user/:userId", getRecipesByUserId);

router.post("/", authenticate, createRecipe);
router.get("/my/recipes", authenticate, getMyRecipes);
router.put("/:id", authenticate, updateRecipe);
router.delete("/:id", authenticate, deleteRecipe);

export default router;
