import supabase from "../config/supabase.js";

export const createRecipe = async (req, res) => {
  try {
    const {
      title,
      description,
      ingredients,
      instructions,
      prep_time,
      cook_time,
      category,
      image_url,
    } = req.body;
    if (!title || !ingredients || !instructions) {
      return res.status(400).json({
        message: "Title, ingrediants, and instructions are required!",
      });
    }

    const payload = {
      user_id: req.user.userId,
      title,
      description,
      ingredients,
      instructions,
      prep_time: prep_time || null,
      cook_time: cook_time || null,
      category: category || null,
      image_url: image_url || null,
      is_featured: false,
    };

    const { data, error } = await supabase
      .from("recipes")
      .insert(payload)
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ message: "Recipe Created Successfully!", data });
  } catch (error) {
    console.error("Create recipe error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getAllRecipes = async (req, res) => {
  try {
    const { category, search, featured, limit = 50, offset = 0 } = req.query;
    let query = supabase
      .from("recipes")
      .select(`*, users:user_id(id, username, email)`)
      .order("created_at", { ascending: false });
    if (category) {
      query = query.eq("category", category);
    }

    if (featured === "true") {
      query = query.eq("is_featured", true);
    }
    if (search) {
      query = query.ilike("title", `%${search}%`);
    }
    query = query.range(offset, offset + limit - 1);
    const { data, error, count } = await query;
    if (error) throw error;
    res.status(200).json({
      data,
      pagination: {
        total: count,
        limit: parseInt(limit),
        offset: parseInt(offset),
      },
    });
  } catch (error) {
    console.error("Get Recipes error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getRecipeById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from("recipes")
      .select(
        `*, users:user_id(
            id, username, email)`,
      )
      .eq("id", id)
      .single();
    if (error) throw error;
    if (!data) {
      return res.status(404).json({ message: "Recipe Not Found!" });
    }
    res.status(200).json({ data });
  } catch (error) {
    console.error("Get Recipe error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getRecipesByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const { data, error } = await supabase
      .from("recipes")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.status(200).json({ data });
  } catch (error) {
    console.error("Get user recipes error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getMyRecipes = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("recipes")
      .select("*")
      .eq("user_id", req.user.userId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.status(200).json({ data });
  } catch (error) {
    console.error("Get my recipes error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const updateRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      ingredients,
      instructions,
      prep_time,
      cook_time,
      category,
      image_url,
    } = req.body;

    const { data: recipe, error: fetchError } = await supabase
      .from("recipes")
      .select("user_id")
      .eq("id", id)
      .single();

    if (fetchError || !recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    if (recipe.user_id !== req.user.userId && req.user.role !== "ADMIN") {
      return res.status(403).json({
        message: "Access denied - You can only edit your own recipes",
      });
    }

    const updates = {
      title,
      description,
      ingredients,
      instructions,
      prep_time,
      cook_time,
      category,
      image_url,
      updated_at: new Date().toISOString(),
    };

    Object.keys(updates).forEach(
      (key) => updates[key] === undefined && delete updates[key],
    );

    const { data, error } = await supabase
      .from("recipes")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    res.status(200).json({
      message: "Recipe updated successfully!",
      data,
    });
  } catch (error) {
    console.error("Update recipe error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const { data: recipe, error: fetchError } = await supabase
      .from("recipes")
      .select("user_id")
      .eq("id", id)
      .single();

    if (fetchError || !recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    if (recipe.user_id !== req.user.userId && req.user.role !== "ADMIN") {
      return res.status(403).json({
        message: "Access denied - You can only delete your own recipes",
      });
    }

    const { error } = await supabase.from("recipes").delete().eq("id", id);

    if (error) throw error;

    res.status(200).json({
      message: "Recipe deleted successfully!",
    });
  } catch (error) {
    console.error("Delete recipe error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getCategories = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("recipes")
      .select("category")
      .not("category", "is", null);

    if (error) throw error;
    const categories = [...new Set(data.map((r) => r.category))].filter(
      Boolean,
    );

    res.status(200).json({ data: categories });
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({ message: error.message });
  }
};
