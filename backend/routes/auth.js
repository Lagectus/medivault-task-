// routes/auth.js
import express from "express";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "medivault2024";
const SESSION_COOKIE = "mv_admin_session";

// POST /api/auth/login
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const token = Buffer.from(`${username}:${Date.now()}`).toString("base64");

    res.cookie(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    return res.json({ success: true, message: "Login successful" });
  }

  return res.status(401).json({ error: "Invalid credentials" });
});

// DELETE /api/auth/logout
router.delete("/logout", (req, res) => {
  res.clearCookie(SESSION_COOKIE);
  res.json({ success: true, message: "Logged out" });
});

// GET /api/auth/check  — frontend check karta hai login hai ya nahi
router.get("/check", requireAuth, (req, res) => {
  res.json({ authenticated: true });
});

export default router;
