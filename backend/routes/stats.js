// routes/stats.js
import express from "express";
import { FileModel } from "../models/File.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// GET /api/stats  (protected — sirf admin dekhega)
router.get("/", requireAuth, async (req, res) => {
  try {
    const docs = await FileModel.find();

    const files = docs.map(f => f.toJSON());
    const totalFiles = files.length;
    const totalViews = files.reduce((sum, f) => sum + (f.views || 0), 0);

    // Category wise count
    const categoryCounts = {};
    files.forEach((f) => {
      categoryCounts[f.category] = (categoryCounts[f.category] || 0) + 1;
    });

    // Recent 5 uploads
    const recentUploads = [...files]
      .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))
      .slice(0, 5)
      .map((f) => ({ ...f, id: f._id.toString() }));

    res.json({ totalFiles, totalViews, categoryCounts, recentUploads });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
