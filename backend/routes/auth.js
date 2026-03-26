// routes/auth.js
import express from "express";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "medivault2024";
const SESSION_COOKIE = "mv_admin_session";

// POST /api/auth/login
// routes/auth.js
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const token = Buffer.from(`${username}:${Date.now()}`).toString("base64");
    res.cookie(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    });
    return res.json({ success: true, token });
  }

  return res.status(401).json({ error: "Invalid credentials" });
});

router.delete("/logout", (req, res) => {
  res.json({ success: true });
});

router.get("/check", requireAuth, (req, res) => {
  res.json({ authenticated: true });
});

export default router;