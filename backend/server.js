// server.js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import filesRouter from "./routes/files.js";
import authRouter from "./routes/auth.js";
import statsRouter from "./routes/stats.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ──
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true, // cookies ke liye
}));
app.use(express.json());
app.use(cookieParser());

// ── Routes ──
app.use("/api/auth", authRouter);
app.use("/api/files", filesRouter);
app.use("/api/stats", statsRouter);

// ── Health check ──
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "MediVault backend running" });
});

// ── Start ──
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
  });
});
