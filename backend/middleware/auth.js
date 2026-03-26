// middleware/auth.js

export function requireAuth(req, res, next) {
  const cookieToken = req.cookies?.mv_admin_session;
  const headerToken = req.headers?.authorization?.replace("Bearer ", "");
  const token = cookieToken || headerToken;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized. Please login." });
  }
  next();
}