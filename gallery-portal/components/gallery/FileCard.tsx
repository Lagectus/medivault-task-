"use client";
import { motion } from "framer-motion";
import { Eye, Calendar, User, FileText, Film, Zap, Download } from "lucide-react";
import { MedicalFile } from "@/types";
import { getCategoryConfig, formatFileSize } from "@/lib/categories";
import { format } from "date-fns";
import FileThumbnail from "./FileThumbnail";

interface FileCardProps {
  file: MedicalFile;
  index: number;
  onClick: (file: MedicalFile) => void;
}

export default function FileCard({ file, index, onClick }: FileCardProps) {
  const cat = getCategoryConfig(file.category);

  const handleDownload = () => {
  if (!file.fileUrl) return;

  const cloudinaryDownloadUrl = file.fileUrl.includes("res.cloudinary.com")
    ? file.fileUrl.replace("/upload/", "/upload/fl_attachment/")
    : file.fileUrl;

  const a = document.createElement("a");
  a.href = cloudinaryDownloadUrl;
  a.download = file.fileName || `${file.title}.${file.fileType}`;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

  const handleOpenFull = () => {
  if (!file.fileUrl) return;
  window.open(file.fileUrl, "_blank", "noopener,noreferrer");
};
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      onClick={() => onClick(file)}
      className="card card-hover group"
      style={{ overflow: "hidden", cursor: "pointer" }}
    >
      {/* Thumbnail */}
      <div style={{ position: "relative", aspectRatio: "4/3", overflow: "hidden", background: cat.bgColor }}>
        <FileThumbnail file={file} size={400} />

        <motion.div
          initial={{ opacity: 0 }} whileHover={{ opacity: 1 }} transition={{ duration: 0.2 }}
          style={{ position: "absolute", inset: 0, background: `linear-gradient(to top, ${cat.bgColor}CC 0%, transparent 50%)` }}
        />

        {/* Category badge */}
        <div className="cat-pill" style={{ position: "absolute", top: 12, left: 12, background: "rgba(255,255,255,0.92)", borderColor: cat.borderColor, color: cat.color }}>
          <span style={{ fontSize: 13 }}>{cat.icon}</span>
          {cat.label}
        </div>

        {/* File type badge */}
        {file.fileType !== "image" && (
          <div style={{ position: "absolute", top: 12, right: 12, display: "flex", alignItems: "center", gap: 4, background: "rgba(255,255,255,0.92)", border: "1px solid var(--border)", borderRadius: 8, padding: "3px 8px", fontSize: 10.5, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            {file.fileType === "pdf"   && <FileText style={{ width: 12, height: 12 }} />}
            {file.fileType === "video" && <Film     style={{ width: 12, height: 12 }} />}
            {file.fileType === "dicom" && <Zap      style={{ width: 12, height: 12 }} />}
            {file.fileType}
          </div>
        )}

        {/* Views on hover */}
        <motion.div
          initial={{ opacity: 0, y: 4 }} whileHover={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
          style={{ position: "absolute", bottom: 10, right: 12, display: "flex", alignItems: "center", gap: 4, fontSize: 11.5, color: cat.color, fontWeight: 600, background: "rgba(255,255,255,0.9)", padding: "3px 9px", borderRadius: 20, border: `1px solid ${cat.borderColor}` }}
        >
          <Eye style={{ width: 12, height: 12 }} strokeWidth={2} />
          {file.views}
        </motion.div>

        {/* Download on hover */}
        {file.fileUrl && (
          <motion.button
            initial={{ opacity: 0, scale: 0.85 }} whileHover={{ opacity: 1, scale: 1 }} transition={{ duration: 0.18 }}
            onClick={handleDownload}
            style={{ position: "absolute", bottom: 10, left: 12, display: "flex", alignItems: "center", gap: 4, fontSize: 11.5, fontWeight: 600, background: "rgba(255,255,255,0.9)", padding: "4px 10px", borderRadius: 20, border: `1px solid ${cat.borderColor}`, color: cat.color, cursor: "pointer" }}
          >
            <Download style={{ width: 11, height: 11 }} strokeWidth={2.5} />
            Download
          </motion.button>
        )}
      </div>

      {/* Card body */}
      <div style={{ padding: "16px 18px" }}>
        <h3 style={{ fontSize: 14.5, fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.4, marginBottom: 6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", transition: "color 0.15s" }}>
          {file.title}
        </h3>
        <p style={{ fontSize: 12.5, color: "var(--text-muted)", lineHeight: 1.55, marginBottom: 12, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {file.description}
        </p>

        {file.tags.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 12 }}>
            {file.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="tag">#{tag}</span>
            ))}
            {file.tags.length > 3 && (
              <span className="tag" style={{ color: "var(--text-faint)" }}>+{file.tags.length - 3}</span>
            )}
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 12, borderTop: "1px solid var(--bg-surface-2)", fontSize: 11.5, color: "var(--text-faint)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <User style={{ width: 11, height: 11 }} strokeWidth={2} />
            <span style={{ maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {file.uploadedBy.replace("Dr. ", "")}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <Calendar style={{ width: 11, height: 11 }} strokeWidth={2} />
            {format(new Date(file.uploadedAt), "MMM d, yyyy")}
          </div>                  
        </div>
      </div>
    </motion.div>
  );
}