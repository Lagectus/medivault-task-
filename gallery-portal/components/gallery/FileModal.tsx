"use client";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, User, Tag, FileText, Download, ExternalLink, Lock, Globe } from "lucide-react";
import { MedicalFile } from "@/types";
import { getCategoryConfig, formatFileSize } from "@/lib/categories";
import { format } from "date-fns";
import FileThumbnail from "./FileThumbnail";
import { filesAPI } from "@/lib/api";

interface FileModalProps {
  file: MedicalFile | null;
  onClose: () => void;
}

export default function FileModal({ file, onClose }: FileModalProps) {
  useEffect(() => {
    if (file) {
      document.body.style.overflow = "hidden";
      filesAPI.incrementView(file.id).catch(() => {});
    }
    return () => { document.body.style.overflow = ""; };
  }, [file]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!file) return null;
  const cat = getCategoryConfig(file.category);

  const handleDownload = () => {
    if (!file?.downloadUrl) { alert("Download URL missing ❌"); return; }
    window.open(file.downloadUrl, "_blank");
  };

  const handleOpenFull = () => {
    if (!file?.fileUrl) { alert("File URL missing ❌"); return; }
    window.open(file.fileUrl, "_blank");
  };

  const meta = [
    { icon: User,     label: "Uploaded By", value: file.uploadedBy },
    { icon: Calendar, label: "Date",        value: format(new Date(file.uploadedAt), "MMM d, yyyy 'at' h:mm a") },
    ...(file.patientId ? [{ icon: FileText, label: "Patient ID", value: file.patientId }] : []),
    { icon: Tag,      label: "File Type",   value: file.fileType.toUpperCase() },
    { icon: FileText, label: "File Size",   value: formatFileSize(file.fileSize) },
  ];

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="modal-backdrop"
        onClick={onClose}
      >
        <motion.div
          key="modal"
          initial={{ opacity: 0, scale: 0.94, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ type: "spring", stiffness: 320, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
          className="modal-box modal-responsive"
        >
          {/* Header */}
          <div className="modal-header">
            <div style={{ flex: 1, paddingRight: 12 }}>
              <div className="cat-pill" style={{ background: cat.bgColor, borderColor: cat.borderColor, color: cat.color, marginBottom: 8 }}>
                {cat.icon} {cat.label}
              </div>
              <h2 className="font-serif" style={{ fontSize: "clamp(18px, 4vw, 24px)", color: "var(--text-primary)", lineHeight: 1.3 }}>
                {file.title}
              </h2>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={onClose}
              style={{ width: 36, height: 36, borderRadius: 10, background: "var(--bg-surface-2)", border: "1px solid var(--border)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", flexShrink: 0 }}
            >
              <X style={{ width: 16, height: 16 }} strokeWidth={2} />
            </motion.button>
          </div>

          {/* Body — stacks vertically on mobile */}
          <div className="modal-body-grid">
            {/* Left – preview */}
            <div className="modal-left">
              <div style={{
                position: "relative",
                borderRadius: 14,
                overflow: "hidden",
                border: "1px solid var(--border)",
                height: 200,
                background: cat.bgColor,
              }}>
                <FileThumbnail file={file} size={480} />
              </div>

              {/* Action buttons */}
              <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={handleDownload}
                  disabled={!file.downloadUrl}
                  className="btn-primary"
                  style={{ flex: 1, justifyContent: "center", background: file.fileUrl ? cat.color : "var(--text-faint)", cursor: file.fileUrl ? "pointer" : "not-allowed", opacity: file.fileUrl ? 1 : 0.5 }}
                >
                  <Download style={{ width: 15, height: 15 }} strokeWidth={2} />
                  Download
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={handleOpenFull}
                  disabled={!file.downloadUrl}
                  className="btn-secondary"
                  style={{ flex: 1, justifyContent: "center", cursor: file.fileUrl ? "pointer" : "not-allowed", opacity: file.fileUrl ? 1 : 0.5 }}
                >
                  <ExternalLink style={{ width: 15, height: 15 }} strokeWidth={2} />
                  Open Full
                </motion.button>
              </div>

              {/* Stats chips */}
              <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                <div style={{ flex: 1, background: cat.bgColor, border: `1px solid ${cat.borderColor}`, borderRadius: 10, padding: "10px 14px", textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>Views</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: cat.color, fontFamily: "'Instrument Serif', serif" }}>{file.views}</div>
                </div>
                <div style={{ flex: 1, background: "var(--bg-surface-2)", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 14px", textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>Size</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: "var(--text-primary)", fontFamily: "'Instrument Serif', serif" }}>{formatFileSize(file.fileSize)}</div>
                </div>
              </div>
            </div>

            {/* Right – details */}
            <div className="modal-right">
              {/* Description */}
              <div>
                <div style={{ fontSize: 10.5, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: "0.09em", color: "var(--text-muted)", marginBottom: 8 }}>Description</div>
                <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.65 }}>
                  {file.description || "No description provided."}
                </p>
              </div>

              {/* Metadata */}
              <div>
                <div style={{ fontSize: 10.5, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: "0.09em", color: "var(--text-muted)", marginBottom: 10 }}>Metadata</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                  {meta.map(({ icon: Icon, label, value }) => (
                    <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: "1px solid var(--bg-surface-2)", fontSize: 13, gap: 8 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 7, color: "var(--text-muted)", flexShrink: 0 }}>
                        <Icon style={{ width: 13, height: 13 }} strokeWidth={2} />
                        {label}
                      </div>
                      <span style={{
                        color: "var(--text-primary)",
                        fontFamily: label === "Patient ID" || label === "File Type" || label === "File Size" ? "'JetBrains Mono', monospace" : "inherit",
                        fontSize: label === "Patient ID" || label === "File Type" ? 12 : 13,
                        fontWeight: 500,
                        textAlign: "right",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        maxWidth: "55%",
                      }}>
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tags */}
              {file.tags.length > 0 && (
                <div>
                  <div style={{ fontSize: 10.5, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: "0.09em", color: "var(--text-muted)", marginBottom: 8 }}>Tags</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {file.tags.map((tag) => (
                      <span key={tag} className="tag" style={{ background: cat.bgColor, borderColor: cat.borderColor, color: cat.color }}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Visibility */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderRadius: 12, background: "var(--bg-surface-2)", border: "1px solid var(--border)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text-secondary)" }}>
                  {file.isPublic
                    ? <Globe style={{ width: 14, height: 14, color: "var(--success)" }} strokeWidth={2} />
                    : <Lock  style={{ width: 14, height: 14, color: "var(--warning)" }} strokeWidth={2} />
                  }
                  Visibility
                </div>
                <span className={file.isPublic ? "badge-public" : "badge-private"}>
                  {file.isPublic ? "● Public" : "○ Private"}
                </span>
              </div>

              {/* Direct URL */}
              {file.fileUrl && (
                <div>
                  <div style={{ fontSize: 10.5, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: "0.09em", color: "var(--text-muted)", marginBottom: 8 }}>Direct URL</div>
                  <div
                    onClick={() => navigator.clipboard?.writeText(file.fileUrl)}
                    title="Click to copy"
                    style={{ padding: "8px 12px", borderRadius: 8, background: "var(--bg-surface-2)", border: "1px solid var(--border)", fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "var(--text-faint)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", cursor: "pointer" }}
                  >
                    {file.fileUrl}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}