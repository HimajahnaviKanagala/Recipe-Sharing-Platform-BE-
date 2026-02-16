import express from "express";
import {
  getRecipeSuggestions,
  chatWithBot,
  testAI,
} from "../controllers/ai.controller.js";
import authenticate from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/test", testAI);

// Recipe suggestions from ingredients (protected)
router.post("/recipe-suggestions", authenticate, getRecipeSuggestions);

// General chat with bot (protected)
router.post("/chat", authenticate, chatWithBot);

export default router;
