"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Eye, EyeOff, FileText, User, Calendar } from "lucide-react";
import { MedicalFile } from "@/types";
import { getCategoryConfig, formatFileSize } from "@/lib/categories";
import { format } from "date-fns";
import { filesAPI } from "@/lib/api";

interface FileTableProps {
  files: MedicalFile[];
  onDelete: (id: string) => void;
  onToggleVisibility: (id: string, isPublic: boolean) => void;
  onRefresh: () => void;
}

export default function FileTable({ files, onDelete, onToggleVisibility, onRefresh }: FileTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      // ← Express backend ko bhejo — Cloudinary se bhi delete hoga
      const res = await filesAPI.delete(id);
      if (!res.ok) throw new Error("Delete failed");
      onDelete(id);
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setDeletingId(null);
      setConfirmId(null);
    }
  };

  const handleToggle = async (file: MedicalFile) => {
    try {
      // ← Express backend ko bhejo
      const res = await filesAPI.toggleVisibility(file.id, !file.isPublic);
      if (!res.ok) throw new Error("Toggle failed");
      onToggleVisibility(file.id, !file.isPublic);
    } catch (err) {
      console.error("Toggle error:", err);
    }
  };

  if (files.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "48px 20px" }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, background: "var(--bg-surface-2)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
          <FileText style={{ width: 24, height: 24, color: "var(--text-faint)" }} strokeWidth={1.5} />
        </div>
        <p style={{ fontSize: 15, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 4 }}>No files found</p>
        <p style={{ fontSize: 13, color: "var(--text-muted)" }}>Try adjusting your search or filter</p>
      </div>
    );
  }

  return (
    <div style={{ overflowX: "auto" }}>
      <table className="data-table">
        <thead>
          <tr>
            {["File", "Category", "Uploader", "Date", "Size", "Views", "Status", "Actions"].map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <AnimatePresence>
            {files.map((file, i) => {
              const cat = getCategoryConfig(file.category);
              return (
                <motion.tr
                  key={file.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16, height: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.3 }}
                >
                  {/* File */}
                  <td style={{ paddingLeft: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 38, height: 38, borderRadius: 10, background: cat.bgColor, border: `1px solid ${cat.borderColor}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: cat.color, letterSpacing: "0.04em" }}>
                          {file.fileType.slice(0, 3).toUpperCase()}
                        </span>
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontSize: 13.5, fontWeight: 600, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 180, marginBottom: 2 }}>
                          {file.title}
                        </p>
                        <p style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "var(--text-faint)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 180 }}>
                          {file.fileName}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td>
                    <span className="cat-pill" style={{ background: cat.bgColor, borderColor: cat.borderColor, color: cat.color, whiteSpace: "nowrap" }}>
                      {cat.icon} {cat.label}
                    </span>
                  </td>

                  {/* Uploader */}
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
                      <User style={{ width: 12, height: 12, color: "var(--text-faint)", flexShrink: 0 }} strokeWidth={2} />
                      <span style={{ maxWidth: 110, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {file.uploadedBy}
                      </span>
                    </div>
                  </td>

                  {/* Date */}
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, whiteSpace: "nowrap" }}>
                      <Calendar style={{ width: 12, height: 12, color: "var(--text-faint)" }} strokeWidth={2} />
                      {format(new Date(file.uploadedAt), "MMM d, yy")}
                    </div>
                  </td>

                  {/* Size */}
                  <td>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12.5, whiteSpace: "nowrap" }}>
                      {formatFileSize(file.fileSize)}
                    </span>
                  </td>

                  {/* Views */}
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13 }}>
                      <Eye style={{ width: 12, height: 12, color: "var(--text-faint)" }} strokeWidth={2} />
                      {file.views}
                    </div>
                  </td>

                  {/* Status */}
                  <td>
                    <span className={file.isPublic ? "badge-public" : "badge-private"}>
                      {file.isPublic ? "● Public" : "○ Private"}
                    </span>
                  </td>

                  {/* Actions */}
                  <td style={{ paddingRight: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      {/* Toggle visibility */}
                      <motion.button
                        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                        onClick={() => handleToggle(file)}
                        title={file.isPublic ? "Make Private" : "Make Public"}
                        style={{ width: 30, height: 30, borderRadius: 8, background: "var(--bg-surface-2)", border: "1px solid var(--border)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}
                      >
                        {file.isPublic
                          ? <Eye style={{ width: 13, height: 13 }} strokeWidth={2} />
                          : <EyeOff style={{ width: 13, height: 13 }} strokeWidth={2} />
                        }
                      </motion.button>

                      {/* Delete */}
                      {confirmId === file.id ? (
                        <div style={{ display: "flex", gap: 4 }}>
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDelete(file.id)}
                            disabled={deletingId === file.id}
                            style={{ padding: "4px 10px", borderRadius: 7, background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626", fontSize: 11.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}
                          >
                            {deletingId === file.id ? "…" : "Delete"}
                          </motion.button>
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setConfirmId(null)}
                            style={{ padding: "4px 8px", borderRadius: 7, background: "var(--bg-surface-2)", border: "1px solid var(--border)", color: "var(--text-muted)", fontSize: 11.5, cursor: "pointer", fontFamily: "inherit" }}
                          >
                            Cancel
                          </motion.button>
                        </div>
                      ) : (
                        <motion.button
                          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                          onClick={() => setConfirmId(file.id)}
                          style={{ width: 30, height: 30, borderRadius: 8, background: "var(--bg-surface-2)", border: "1px solid var(--border)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", transition: "all 0.15s" }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.background = "#FEF2F2";
                            (e.currentTarget as HTMLButtonElement).style.borderColor = "#FECACA";
                            (e.currentTarget as HTMLButtonElement).style.color = "#DC2626";
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-surface-2)";
                            (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)";
                            (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)";
                          }}
                        >
                          <Trash2 style={{ width: 13, height: 13 }} strokeWidth={2} />
                        </motion.button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
}