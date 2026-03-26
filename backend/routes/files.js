import express from "express";
import multer from "multer";
import mongoose from "mongoose";
import { FileModel } from "../models/File.js";
import cloudinary from "../lib/cloudinary.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 },
});

function isValidId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// ─────────────────────────────
// GET ALL FILES
// ─────────────────────────────
router.get("/", async (req, res) => {
  try {
    const docs = await FileModel.find().sort({ uploadedAt: -1 });
    res.json({ files: docs.map((f) => f.toJSON()) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────
// GET SINGLE FILE
// ─────────────────────────────
router.get("/:id", async (req, res) => {
  if (!isValidId(req.params.id)) {
    return res.status(400).json({ error: "Invalid file ID" });
  }

  try {
    const file = await FileModel.findById(req.params.id);
    if (!file) return res.status(404).json({ error: "File not found" });

    res.json(file.toJSON());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────
// UPLOAD FILE
// ─────────────────────────────
router.post("/", requireAuth, upload.single("file"), async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      uploadedBy = "Admin",
      patientId = "",
      isPublic = "true",
      tags = "",
    } = req.body;

    if (!title || !category) {
      return res.status(400).json({ error: "Title aur category required hai" });
    }

    const parsedTags = tags
      ? tags.split(",").map((t) => t.trim()).filter(Boolean)
      : [];

    let url = "", downloadUrl = "", publicId = "";
    let fileType = "image", fileName = "", fileSize = 0;

    if (req.file) {
      fileName = req.file.originalname;
      fileSize = req.file.size;

      const mime = req.file.mimetype;

      let resourceType = "raw";

      if (mime.startsWith("image/")) {
        resourceType = "image";
        fileType = "image";
      } else if (mime === "application/pdf") {
        resourceType = "raw";
        fileType = "pdf";
      } else if (mime.startsWith("video/")) {
        resourceType = "video";
        fileType = "video";
      } else {
        fileType = "dicom";
      }

      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "medivault",
            resource_type: resourceType,
            public_id: `${Date.now()}-${fileName.replace(/\s+/g, "_")}`,
            
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      publicId = uploadResult.public_id;
      url = uploadResult.secure_url;

      // ✅ BEST FIX (NO FAILED LOAD)
      downloadUrl = uploadResult.secure_url.replace(
        "/upload/",
        "/upload/fl_attachment/"
      );
      console.log("SECURE:", uploadResult.secure_url);
      console.log("DOWNLOAD:", downloadUrl);
    }

    const newFile = await FileModel.create({
      title,
      description,
      category,
      uploadedBy,
      patientId,
      isPublic: isPublic === "true",
      tags: parsedTags,
      url,
      downloadUrl,
      publicId,
      fileType,
      fileName,
      fileSize,
    });

    res.status(201).json(newFile.toJSON());
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────
// INCREMENT VIEW
// ─────────────────────────────
router.patch("/view/:id", async (req, res) => {
  if (!isValidId(req.params.id)) {
    return res.status(400).json({ error: "Invalid file ID" });
  }

  try {
    const file = await FileModel.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!file) return res.status(404).json({ error: "File not found" });

    res.json(file.toJSON());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────
// TOGGLE VISIBILITY
// ─────────────────────────────
router.patch("/:id", requireAuth, async (req, res) => {
  if (!isValidId(req.params.id)) {
    return res.status(400).json({ error: "Invalid file ID" });
  }

  try {
    const file = await FileModel.findByIdAndUpdate(
      req.params.id,
      { isPublic: req.body.isPublic },
      { new: true }
    );

    if (!file) return res.status(404).json({ error: "File not found" });

    res.json(file.toJSON());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────
// DELETE
// ─────────────────────────────
router.delete("/:id", requireAuth, async (req, res) => {
  if (!isValidId(req.params.id)) {
    return res.status(400).json({ error: "Invalid file ID" });
  }

  try {
    const file = await FileModel.findById(req.params.id);
    if (!file) return res.status(404).json({ error: "File not found" });

    if (file.publicId) {
      const resourceType =
        file.fileType === "video"
          ? "video"
          : file.fileType === "pdf" || file.fileType === "dicom"
          ? "raw"
          : "image";

      await cloudinary.uploader.destroy(file.publicId, {
        resource_type: resourceType,
      });
    }

    await FileModel.findByIdAndDelete(req.params.id);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;