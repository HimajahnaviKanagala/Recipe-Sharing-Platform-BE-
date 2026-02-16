const RECIPE_DATABASE = {
  chicken: {
    emoji: "🍗",
    recipes: [
      {
        name: "Chicken Curry",
        time: "40 min",
        difficulty: "Medium",
        desc: "Creamy, spicy curry with tender chicken",
      },
      {
        name: "Grilled Chicken",
        time: "25 min",
        difficulty: "Easy",
        desc: "Light and healthy with herbs",
      },
      {
        name: "Chicken Stir-Fry",
        time: "20 min",
        difficulty: "Easy",
        desc: "Quick Asian-inspired dish",
      },
    ],
  },
  pasta: {
    emoji: "🍝",
    recipes: [
      {
        name: "Carbonara",
        time: "20 min",
        difficulty: "Easy",
        desc: "Classic creamy Roman pasta",
      },
      {
        name: "Aglio e Olio",
        time: "15 min",
        difficulty: "Easy",
        desc: "Garlic and olive oil pasta",
      },
      {
        name: "Marinara",
        time: "25 min",
        difficulty: "Easy",
        desc: "Simple tomato sauce",
      },
    ],
  },
  rice: {
    emoji: "🍚",
    recipes: [
      {
        name: "Fried Rice",
        time: "20 min",
        difficulty: "Easy",
        desc: "Restaurant-style fried rice",
      },
      {
        name: "Risotto",
        time: "30 min",
        difficulty: "Medium",
        desc: "Creamy Italian rice",
      },
      {
        name: "Rice Bowl",
        time: "15 min",
        difficulty: "Easy",
        desc: "Healthy grain bowl",
      },
    ],
  },
  egg: {
    emoji: "🥚",
    recipes: [
      {
        name: "Omelette",
        time: "10 min",
        difficulty: "Easy",
        desc: "Fluffy breakfast classic",
      },
      {
        name: "Scrambled Eggs",
        time: "5 min",
        difficulty: "Easy",
        desc: "Quick and creamy",
      },
      {
        name: "Frittata",
        time: "25 min",
        difficulty: "Medium",
        desc: "Italian baked eggs",
      },
    ],
  },
};

// Simple response templates
const CHAT_RESPONSES = {
  greeting:
    "Hello! 👋 I'm your cooking assistant! Tell me what ingredients you have and I'll suggest recipes!",
  help: "I can help with:\n🍳 Recipe suggestions\n👨‍🍳 Cooking tips\n⏱️ Cooking times\n\nJust tell me what ingredients you have!",
  thanks: "You're welcome! 😊 Happy cooking!",
  default:
    "Tell me what ingredients you have, like 'chicken and rice' or 'pasta and tomatoes', and I'll suggest recipes! 🍳",
};

// Helper function to detect ingredients
function detectIngredient(text) {
  const lower = text.toLowerCase();
  for (const ingredient in RECIPE_DATABASE) {
    if (lower.includes(ingredient)) return ingredient;
  }
  return null;
}

// Helper function to format recipes
function formatRecipes(ingredient, data) {
  let output = `${data.emoji} **${ingredient.charAt(0).toUpperCase() + ingredient.slice(1)} Recipes**\n\n`;

  data.recipes.forEach((recipe, i) => {
    output += `**${i + 1}. ${recipe.name}**\n`;
    output += `- ${recipe.difficulty} | ${recipe.time}\n`;
    output += `- ${recipe.desc}\n\n`;
  });

  return output;
}

// Main functions
export const getRecipeSuggestions = async (req, res) => {
  try {
    const { ingredients } = req.body;

    if (!ingredients?.trim()) {
      return res.status(400).json({ message: "Please provide ingredients" });
    }

    console.log("🤖 Recipe suggestions for:", ingredients);

    const detected = detectIngredient(ingredients);

    let suggestions;
    if (detected && RECIPE_DATABASE[detected]) {
      suggestions = formatRecipes(detected, RECIPE_DATABASE[detected]);
    } else {
      suggestions =
        `🍳 **Quick Ideas with ${ingredients}**\n\n` +
        `**1. Simple Sauté** (15 min, Easy)\n- Cook with garlic and oil\n\n` +
        `**2. Baked Dish** (30 min, Easy)\n- Season and bake at 375°F\n\n` +
        `**3. One-Pot Meal** (35 min, Easy)\n- Combine in pot with broth`;
    }

    res.json({
      message: "Recipe suggestions generated!",
      ingredients,
      suggestions: { rawText: suggestions, parsed: false },
    });
  } catch (error) {
    console.error("❌ Error:", error.message);
    res.status(500).json({
      message: "Failed to generate suggestions",
      error: error.message,
    });
  }
};

export const chatWithBot = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({ message: "Please provide a message" });
    }

    console.log("🤖 Chat:", message);

    const lower = message.toLowerCase();
    let reply;

    // Simple pattern matching
    if (/^(hi|hello|hey)/.test(lower)) {
      reply = CHAT_RESPONSES.greeting;
    } else if (/help|what can you do/.test(lower)) {
      reply = CHAT_RESPONSES.help;
    } else if (/thank/.test(lower)) {
      reply = CHAT_RESPONSES.thanks;
    } else {
      // Check for ingredients
      const detected = detectIngredient(message);
      if (detected && RECIPE_DATABASE[detected]) {
        const data = RECIPE_DATABASE[detected];
        reply = `${data.emoji} Great! With ${detected}, you can make:\n\n`;
        data.recipes.forEach((r) => (reply += `• ${r.name} (${r.time})\n`));
        reply += "\nWant the full recipe for any of these?";
      } else {
        reply = CHAT_RESPONSES.default;
      }
    }

    res.json({
      message: "Response generated!",
      userMessage: message,
      botReply: reply,
    });
  } catch (error) {
    console.error("❌ Error:", error.message);
    res
      .status(500)
      .json({ message: "Failed to generate response", error: error.message });
  }
};

export const testAI = async (req, res) => {
  res.json({
    success: true,
    message: "AI Cooking Assistant is ready! 🎉",
    response: "Hello! Tell me what ingredients you have!",
    model: "cooking-assistant-v1",
  });
};
