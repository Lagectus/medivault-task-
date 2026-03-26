// middleware/auth.js

export function requireAuth(req, res, next) {
  const token = req.cookies?.mv_admin_session;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized. Please login." });
  }
  next();
}
