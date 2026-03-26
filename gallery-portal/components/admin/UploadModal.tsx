"use client";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";
import { X, Upload, File, CheckCircle, AlertCircle, Loader2, Plus } from "lucide-react";
import { CATEGORIES } from "@/lib/categories";
import { Category } from "@/types";
import { filesAPI } from "@/lib/api";

interface UploadModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function UploadModal({ open, onClose, onSuccess }: UploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "general" as Category,
    uploadedBy: "",
    patientId: "",
    isPublic: true,
    tagInput: "",
    tags: [] as string[],
  });
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback((accepted: File[]) => {
    if (accepted[0]) setFile(accepted[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*":         [".png", ".jpg", ".jpeg", ".gif", ".webp", ".tiff"],
      "application/pdf": [".pdf"],
      "video/*":         [".mp4", ".avi", ".mov"],
    },
    maxSize: 100 * 1024 * 1024,
    multiple: false,
  });

  const addTag = () => {
    const tag = form.tagInput.trim().toLowerCase();
    if (tag && !form.tags.includes(tag))
      setForm((f) => ({ ...f, tags: [...f.tags, tag], tagInput: "" }));
  };

  const removeTag = (tag: string) =>
    setForm((f) => ({ ...f, tags: f.tags.filter((t) => t !== tag) }));

  const handleSubmit = async () => {
    if (!form.title || !form.category) { setError("Title aur category required hai."); return; }
    setStatus("uploading"); setProgress(0); setError("");
    const interval = setInterval(() => setProgress((p) => Math.min(p + Math.random() * 18, 90)), 180);
    try {
      const fd = new FormData();
      if (file) fd.append("file", file);
      fd.append("title",       form.title);
      fd.append("description", form.description);
      fd.append("category",    form.category);
      fd.append("uploadedBy",  form.uploadedBy || "Admin");
      fd.append("patientId",   form.patientId);
      fd.append("isPublic",    String(form.isPublic));
      fd.append("tags",        form.tags.join(","));
      const res = await filesAPI.upload(fd);
      clearInterval(interval);
      if (!res.ok) { const data = await res.json(); throw new Error(data.error || "Upload failed"); }
      setProgress(100); setStatus("success");
      setTimeout(() => { onSuccess(); handleClose(); }, 1200);
    } catch (err: any) {
      clearInterval(interval);
      setError(err.message || "Upload failed. Please try again.");
      setStatus("error");
    }
  };

  const handleClose = () => {
    setFile(null);
    setForm({ title: "", description: "", category: "general", uploadedBy: "", patientId: "", isPublic: true, tagInput: "", tags: [] });
    setStatus("idle"); setProgress(0); setError(""); onClose();
  };

  const selectedCat = CATEGORIES.find((c) => c.id === form.category);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="modal-backdrop"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 28 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="modal-box modal-responsive upload-modal"
          >
            {/* Header */}
            <div className="modal-header">
              <div>
                <h2 style={{ fontSize: "clamp(17px, 4vw, 20px)", fontWeight: 700, color: "var(--text-primary)", fontFamily: "'Instrument Serif', serif" }}>
                  Upload Medical File
                </h2>
                <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 3 }}>
                  Images, PDFs, Videos, or DICOM files
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={handleClose}
                style={{ width: 34, height: 34, borderRadius: 9, background: "var(--bg-surface-2)", border: "1px solid var(--border)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", flexShrink: 0 }}
              >
                <X style={{ width: 15, height: 15 }} strokeWidth={2.5} />
              </motion.button>
            </div>

            <div style={{ padding: "20px 22px", display: "flex", flexDirection: "column", gap: 16 }}>

              {/* Dropzone */}
              <div {...getRootProps()} className={isDragActive ? "dropzone dropzone-active" : "dropzone"}>
                <input {...getInputProps()} />
                {file ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--accent-light)", border: "1px solid #BAE6FD", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <File style={{ width: 22, height: 22, color: "var(--accent)" }} strokeWidth={1.5} />
                    </div>
                    <div style={{ textAlign: "left", flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.name}</p>
                      <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); setFile(null); }} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 4, flexShrink: 0 }}>
                      <X style={{ width: 16, height: 16 }} />
                    </button>
                  </div>
                ) : (
                  <div>
                    <div style={{ width: 48, height: 48, borderRadius: 14, background: "var(--bg-surface)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                      <Upload style={{ width: 22, height: 22, color: "var(--text-muted)" }} strokeWidth={1.5} />
                    </div>
                    <p style={{ fontSize: 14, color: "var(--text-secondary)", fontWeight: 500 }}>
                      {isDragActive ? "Drop the file here…" : "Drag & drop or click to select"}
                    </p>
                    <p style={{ fontSize: 12, color: "var(--text-faint)", marginTop: 4 }}>Max 100MB · PNG, JPG, PDF, MP4, DICOM</p>
                  </div>
                )}
              </div>

              {/* Title */}
              <div>
                <label className="form-label">Title *</label>
                <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className="input" placeholder="e.g., Chest X-Ray – Patient 2024" />
              </div>

              {/* Description */}
              <div>
                <label className="form-label">Description</label>
                <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="input" rows={3} placeholder="Clinical notes, findings, or case description…" style={{ resize: "none" }} />
              </div>

              {/* Category + Uploader — responsive grid */}
              <div className="form-grid-2">
                <div>
                  <label className="form-label">Category *</label>
                  <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as Category }))} className="input" style={{ cursor: "pointer" }}>
                    {CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.icon} {cat.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="form-label">Uploaded By</label>
                  <input value={form.uploadedBy} onChange={(e) => setForm((f) => ({ ...f, uploadedBy: e.target.value }))} className="input" placeholder="Dr. Name" />
                </div>
              </div>

              {/* Patient ID + Visibility — responsive grid */}
              <div className="form-grid-2">
                <div>
                  <label className="form-label">Patient ID</label>
                  <input value={form.patientId} onChange={(e) => setForm((f) => ({ ...f, patientId: e.target.value }))} className="input" placeholder="P-2024-001" style={{ fontFamily: "'JetBrains Mono', monospace" }} />
                </div>
                <div>
                  <label className="form-label">Visibility</label>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--bg-surface-2)", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 14px", height: 44 }}>
                    <span style={{ fontSize: 13.5, color: "var(--text-secondary)" }}>{form.isPublic ? "Public" : "Private"}</span>
                    <button onClick={() => setForm((f) => ({ ...f, isPublic: !f.isPublic }))} className={`toggle ${form.isPublic ? "on" : "off"}`}>
                      <div className="toggle-thumb" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="form-label">Tags</label>
                <div style={{ display: "flex", gap: 8 }}>
                  <input value={form.tagInput} onChange={(e) => setForm((f) => ({ ...f, tagInput: e.target.value }))} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }} className="input" placeholder="Add tag and press Enter…" />
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={addTag} style={{ width: 44, height: 44, borderRadius: 10, background: "var(--bg-surface-2)", border: "1px solid var(--border)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)", flexShrink: 0 }}>
                    <Plus style={{ width: 18, height: 18 }} strokeWidth={2} />
                  </motion.button>
                </div>
                <AnimatePresence>
                  {form.tags.length > 0 && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
                      {form.tags.map((tag) => (
                        <motion.span key={tag} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="tag" style={{ background: selectedCat?.bgColor, borderColor: selectedCat?.borderColor, color: selectedCat?.color }}>
                          #{tag}
                          <button onClick={() => removeTag(tag)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, marginLeft: 2, color: "inherit", display: "flex" }}>
                            <X style={{ width: 10, height: 10 }} strokeWidth={3} />
                          </button>
                        </motion.span>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Progress */}
              <AnimatePresence>
                {status === "uploading" && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--text-muted)", marginBottom: 6 }}>
                      <span>Uploading to Cloudinary…</span>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{Math.round(progress)}%</span>
                    </div>
                    <div className="progress-track"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderRadius: 10, background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626", fontSize: 13 }}>
                    <AlertCircle style={{ width: 16, height: 16, flexShrink: 0 }} strokeWidth={2} />
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit */}
              <motion.button
                whileHover={{ scale: status === "idle" ? 1.01 : 1 }}
                whileTap={{ scale: status === "idle" ? 0.98 : 1 }}
                onClick={handleSubmit}
                disabled={status === "uploading" || status === "success"}
                className="btn-primary"
                style={{ width: "100%", justifyContent: "center", padding: "13px 0", fontSize: 15, background: status === "success" ? "#059669" : "var(--text-primary)", opacity: status === "uploading" ? 0.7 : 1 }}
              >
                {status === "uploading" && <Loader2 style={{ width: 17, height: 17, animation: "spin 1s linear infinite" }} />}
                {status === "success"   && <CheckCircle style={{ width: 17, height: 17 }} />}
                {status === "idle"      && <Upload style={{ width: 17, height: 17 }} strokeWidth={2} />}
                {status === "uploading" ? "Uploading…" : status === "success" ? "Uploaded!" : "Upload File"}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}