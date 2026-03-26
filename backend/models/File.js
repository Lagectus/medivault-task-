import mongoose from "mongoose";

const FileSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String, default: "" },
  category:    { type: String, required: true },
  uploadedBy:  { type: String, default: "Admin" },
  patientId:   { type: String, default: "" },
  isPublic:    { type: Boolean, default: true },
  tags:        [{ type: String }],

  url:         { type: String, default: "" },   // preview
  downloadUrl: { type: String, default: "" },   // download
  publicId:    { type: String, default: "" },

  fileType:    { type: String, enum: ["image", "pdf", "video", "dicom"], default: "image" },
  fileName:    { type: String, default: "" },
  fileSize:    { type: Number, default: 0 },
  views:       { type: Number, default: 0 },

  uploadedAt:  { type: Date, default: Date.now },
});

FileSchema.set("toJSON", {
  virtuals: true,
  transform: (_, ret) => {
    ret.id = ret._id.toString();

    ret.fileUrl = ret.url; // 👈 preview
    ret.downloadUrl = ret.downloadUrl || ret.url; // 👈 fallback

    delete ret.url;
    delete ret._id;
    delete ret.__v;

    return ret;
  },
});

export const FileModel =
  mongoose.models.File || mongoose.model("File", FileSchema);