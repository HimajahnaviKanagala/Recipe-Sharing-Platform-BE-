import express from "express";
import dotenv from "dotenv";
import dbConnectionCheck from "./src/utils/dbHealthCheck.js";
import cors from "cors";
import authRoutes from "./src/routes/auth.routes.js";
import recipeRoutes from "./src/routes/recipe.routes.js";
import adminRoutes from "./src/routes/admin.routes.js";
import aiRoutes from "./src/routes/ai.routes.js";

dotenv.config();
const app = express();
app.use(express.json());

const allowedOrigins = ["http://localhost:5173"];

const corsOptions = {
  origin: function (origin, callback) {
    if (
      !origin ||
      allowedOrigins.includes(origin) ||
      origin.endsWith(".vercel.app")
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

app.use("/api/auth", authRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/ai", aiRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, async () => {
  try {
    await dbConnectionCheck();
    console.log(`Server running on port ${PORT}`);
  } catch (error) {
    console.log("Error Occured While Connection to database!");
  }
});
