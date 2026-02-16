import supabase from "../config/supabase.js";

// Get all users (admin only)
export const getAllUsers = async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;

    const { data, error, count } = await supabase
      .from("users")
      .select("id, username, email, role, created_at", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

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
    console.error("Get all users error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get user by ID (admin only)
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("users")
      .select("id, username, email, role, created_at")
      .eq("id", id)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ data });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Delete user (admin only)
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent admin from deleting themselves
    if (id === req.user.userId) {
      return res.status(400).json({
        message: "You cannot delete your own account",
      });
    }

    // Check if user exists
    const { data: user, error: fetchError } = await supabase
      .from("users")
      .select("id")
      .eq("id", id)
      .single();

    if (fetchError || !user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { error } = await supabase.from("users").delete().eq("id", id);

    if (error) throw error;

    res.status(200).json({
      message: "User deleted successfully!",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Update user role (admin only)
export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // Validate role
    if (!["USER", "MODERATOR", "ADMIN"].includes(role)) {
      return res.status(400).json({
        message: "Invalid role. Must be USER, MODERATOR, or ADMIN",
      });
    }

    // Prevent admin from changing their own role
    if (id === req.user.userId) {
      return res.status(400).json({
        message: "You cannot change your own role",
      });
    }

    // Update role
    const { data, error } = await supabase
      .from("users")
      .update({ role })
      .eq("id", id)
      .select("id, username, email, role")
      .single();

    if (error) throw error;

    res.status(200).json({
      message: "User role updated successfully!",
      data,
    });
  } catch (error) {
    console.error("Update user role error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Delete any recipe (admin/moderator)
export const deleteAnyRecipe = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if recipe exists
    const { data: recipe, error: fetchError } = await supabase
      .from("recipes")
      .select("id, title, user_id")
      .eq("id", id)
      .single();

    if (fetchError || !recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // Delete recipe
    const { error } = await supabase.from("recipes").delete().eq("id", id);

    if (error) throw error;

    res.status(200).json({
      message: "Recipe deleted successfully!",
      deletedRecipe: {
        id: recipe.id,
        title: recipe.title,
      },
    });
  } catch (error) {
    console.error("Delete recipe error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Toggle featured status (admin only)
export const toggleFeaturedRecipe = async (req, res) => {
  try {
    const { id } = req.params;

    // Get current featured status
    const { data: recipe, error: fetchError } = await supabase
      .from("recipes")
      .select("is_featured")
      .eq("id", id)
      .single();

    if (fetchError || !recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // Toggle featured status
    const { data, error } = await supabase
      .from("recipes")
      .update({ is_featured: !recipe.is_featured })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    res.status(200).json({
      message: `Recipe ${data.is_featured ? "featured" : "unfeatured"} successfully!`,
      data,
    });
  } catch (error) {
    console.error("Toggle featured error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get platform statistics (admin only)
export const getStats = async (req, res) => {
  try {
    // Get total users
    const { count: totalUsers, error: usersError } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true });

    if (usersError) throw usersError;

    // Get total recipes
    const { count: totalRecipes, error: recipesError } = await supabase
      .from("recipes")
      .select("*", { count: "exact", head: true });

    if (recipesError) throw recipesError;

    // Get featured recipes count
    const { count: featuredRecipes, error: featuredError } = await supabase
      .from("recipes")
      .select("*", { count: "exact", head: true })
      .eq("is_featured", true);

    if (featuredError) throw featuredError;

    // Get users by role
    const { data: usersByRole, error: roleError } = await supabase
      .from("users")
      .select("role");

    if (roleError) throw roleError;

    const roleCounts = usersByRole.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {});

    // Get recent users (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { count: newUsers, error: newUsersError } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true })
      .gte("created_at", sevenDaysAgo.toISOString());

    if (newUsersError) throw newUsersError;

    // Get recent recipes (last 7 days)
    const { count: newRecipes, error: newRecipesError } = await supabase
      .from("recipes")
      .select("*", { count: "exact", head: true })
      .gte("created_at", sevenDaysAgo.toISOString());

    if (newRecipesError) throw newRecipesError;

    res.status(200).json({
      data: {
        totalUsers,
        totalRecipes,
        featuredRecipes,
        usersByRole: roleCounts,
        recentActivity: {
          newUsersLast7Days: newUsers,
          newRecipesLast7Days: newRecipes,
        },
      },
    });
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({ message: error.message });
  }
};
