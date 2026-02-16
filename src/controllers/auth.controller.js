import supabase from "../config/supabase.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Please provide all fields" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const { data: existingUsername } = await supabase
      .from("users")
      .select()
      .eq("username", username)
      .maybeSingle();

    if (existingUsername) {
      return res.status(409).json({ message: "Username already taken!" });
    }

    const { data: existingUser } = await supabase
      .from("users")
      .select()
      .eq("email", email)
      .maybeSingle();

    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User with this email already exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const payload = {
      username,
      email,
      password: hashedPassword,
      role: "USER",
    };

    const { data, error } = await supabase
      .from("users")
      .insert(payload)
      .select("id, username, email, role")
      .single();

    if (error) throw error;

    const token = jwt.sign(
      {
        userId: data.id,
        role: data.role,
        email: data.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.status(201).json({
      message: "User signup successful!",
      data: {
        id: data.id,
        username: data.username,
        email: data.email,
        role: data.role,
        token,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const { data: existingUser } = await supabase
      .from("users")
      .select()
      .eq("email", email)
      .maybeSingle();

    if (!existingUser) {
      return res.status(404).json({ message: "User not found!" });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials!" }); // ✅ Changed to 401
    }

    const token = jwt.sign(
      {
        userId: existingUser.id,
        role: existingUser.role,
        email: existingUser.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.status(200).json({
      message: "User logged in successfully!",
      data: {
        id: existingUser.id,
        username: existingUser.username,
        email: existingUser.email,
        role: existingUser.role,
        token,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("id, email, username, role, created_at")
      .eq("id", req.user.userId)
      .single();

    if (error) throw error;

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
