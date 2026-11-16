import express from "express";
import cors from "cors";
import pool from "./config/db.js";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import marketRoutes from "./routes/marketRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to Thriftify API!",
    status: `
  💅🏽 It's giving MARKETPLACE!

  🛍️ Thriftify is officially LIVE!
  🚀 Server running on port ${PORT}
  💜 Let's get this shopping party started!

  ✨ Happy coding, boss!
  `,
  });
});

app.get("/api/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.status(200).json({
      message: "Database connected successfully!",
      time: result.rows[0].now,
    });
  } catch (error) {
    console.error("Database connection failed:", error.message);

    res.status(500).json({
      message: "Database connection failed",
    });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/markets", marketRoutes);

// Start server
const PORT = 3500;

app.listen(PORT, () => {
  console.log(`Thriftify server running on: http://localhost:${PORT}`);
});
