"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation"; // ✅ add kiya
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import {
  LayoutDashboard, Files, BarChart3, FileImage, Eye,
  HardDrive, TrendingUp, Plus, RefreshCw, Folder,
  Upload, Activity, Shield
} from "lucide-react";
import Navbar from "@/components/Navbar";
import StatsCard from "@/components/admin/StatsCard";
import FileTable from "@/components/admin/FileTable";
import UploadModal from "@/components/admin/UploadModal";
import CategoryFilter from "@/components/gallery/CategoryFilter";
import SearchBar from "@/components/gallery/SearchBar";
import { MedicalFile } from "@/types";
import { getCategoryConfig, formatFileSize, CATEGORIES } from "@/lib/categories";
import { filesAPI, statsAPI } from "@/lib/api";

type AdminTab = "overview" | "files" | "analytics";

export default function AdminPage() {
  const router = useRouter(); // ✅ add kiya
  const [tab, setTab] = useState<AdminTab>("overview");
  const [files, setFiles] = useState<MedicalFile[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<MedicalFile[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const sidebarRef = useRef<HTMLDivElement>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [filesRes, statsRes] = await Promise.all([filesAPI.getAll(), statsAPI.get()]);
      const filesData = await filesRes.json();
      const statsData = await statsRes.json();
      setFiles(filesData.files || []);
      setFilteredFiles(filesData.files || []);
      setStats(statsData);
    } catch (err) { console.error("Fetch error:", err); }
    finally { setLoading(false); }
  }, []);

  // ✅ Single useEffect — auth check + fetchAll dono yahan
  useEffect(() => {
    const token = localStorage.getItem("mv_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }
    fetchAll();
  }, [fetchAll]); // ✅ duplicate useEffect hataaya

  useEffect(() => {
    let result = [...files];
    if (category !== "all") result = result.filter((f) => f.category === category);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((f) => f.title.toLowerCase().includes(q) || f.tags.some((t) => t.includes(q)));
    }
    setFilteredFiles(result);
  }, [files, category, search]);

  useEffect(() => {
    if (!sidebarRef.current) return;
    gsap.fromTo(
      sidebarRef.current.querySelectorAll(".sb-item"),
      { opacity: 0, x: -18 },
      { opacity: 1, x: 0, stagger: 0.08, duration: 0.5, ease: "power3.out", delay: 0.2 }
    );
  }, []);

  const handleDelete = (id: string) => setFiles((p) => p.filter((f) => f.id !== id));
  const handleToggle = (id: string, isPublic: boolean) =>
    setFiles((p) => p.map((f) => (f.id === id ? { ...f, isPublic } : f)));

  const sidebarTabs: { id: AdminTab; label: string; icon: any }[] = [
    { id: "overview",  label: "Overview",      icon: LayoutDashboard },
    { id: "files",     label: "File Manager",  icon: Files },
    { id: "analytics", label: "Analytics",     icon: BarChart3 },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <Navbar />
      <div className="admin-layout">
        <aside ref={sidebarRef} className="admin-sidebar">
          <div className="card" style={{ padding: 14, position: "sticky", top: 82 }}>
            <div className="sb-item" style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 10px 14px", borderBottom: "1px solid var(--bg-surface-2)", marginBottom: 8, opacity: 0 }}>
              <div style={{ width: 36, height: 36, borderRadius: 11, background: "#EFF6FF", border: "1px solid #BFDBFE", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Shield style={{ width: 18, height: 18, color: "#1E40AF" }} strokeWidth={1.8} />
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>Admin Panel</p>
                <p style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: "var(--text-faint)" }}>v2.4.0</p>
              </div>
            </div>

            <nav style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 14 }}>
              {sidebarTabs.map(({ id, label, icon: Icon }) => (
                <button key={id} className={`sb-item sidebar-nav-item ${tab === id ? "active" : ""}`} style={{ opacity: 0 }} onClick={() => setTab(id)}>
                  <Icon style={{ width: 16, height: 16, flexShrink: 0 }} strokeWidth={1.8} />
                  {label}
                </button>
              ))}
            </nav>

            <div className="sb-item" style={{ borderTop: "1px solid var(--bg-surface-2)", paddingTop: 14, opacity: 0 }}>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={() => setUploadOpen(true)} className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "9px 0", fontSize: 13 }}>
                <Plus style={{ width: 15, height: 15 }} strokeWidth={2.5} />
                Upload File
              </motion.button>
            </div>
          </div>
        </aside>

        <main style={{ flex: 1, minWidth: 0 }}>
          <AnimatePresence mode="wait">

            {tab === "overview" && (
              <motion.div key="overview" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, gap: 12 }}>
                  <div>
                    <h1 className="font-serif" style={{ fontSize: "clamp(20px, 5vw, 26px)", color: "var(--text-primary)" }}>Dashboard Overview</h1>
                    <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 3 }}>Real-time summary of your medical gallery</p>
                  </div>
                  <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={fetchAll} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 9, background: "var(--bg-surface)", border: "1px solid var(--border)", cursor: "pointer", fontSize: 12.5, color: "var(--text-muted)", fontFamily: "inherit" }}>
                      <RefreshCw style={{ width: 13, height: 13 }} strokeWidth={2} />
                      <span className="hide-mobile">Refresh</span>
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={() => setUploadOpen(true)} className="btn-primary show-mobile" style={{ fontSize: 13, padding: "8px 14px" }}>
                      <Plus style={{ width: 15, height: 15 }} strokeWidth={2.5} />
                    </motion.button>
                  </div>
                </div>

                <div className="stats-grid">
                  <StatsCard label="Total Files"  value={stats?.totalFiles || 0}  icon={FileImage} color="#0369A1" bgColor="#EFF6FF" borderColor="#BFDBFE" trend="All uploaded files" index={0} />
                  <StatsCard label="Total Views"  value={stats?.totalViews || 0}  icon={Eye}       color="#059669" bgColor="#ECFDF5" borderColor="#A7F3D0" trend="Across all files"  index={1} />
                  <StatsCard label="Categories"   value={CATEGORIES.length}        icon={Folder}    color="#7C3AED" bgColor="#F5F3FF" borderColor="#DDD6FE" trend="Active departments" index={2} />
                  <StatsCard label="Storage" value={formatFileSize(files.reduce((a, f) => a + f.fileSize, 0))} icon={HardDrive} color="#B45309" bgColor="#FFFBEB" borderColor="#FDE68A" trend="Total disk usage" index={3} />
                </div>

                <div className="admin-two-col" style={{ marginBottom: 16, marginTop: 16 }}>
                  <div className="card" style={{ padding: "22px 24px" }}>
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginBottom: 18, display: "flex", alignItems: "center", gap: 8 }}>
                      <BarChart3 style={{ width: 16, height: 16, color: "#0369A1" }} strokeWidth={2} />
                      Category Breakdown
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      {CATEGORIES.map((cat) => {
                        const count = stats?.categoryCounts?.[cat.id] || 0;
                        const total = stats?.totalFiles || 1;
                        const pct = Math.round((count / total) * 100);
                        return (
                          <div key={cat.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <div style={{ width: 84, fontSize: 12, color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flexShrink: 0 }}>{cat.label}</div>
                            <div style={{ flex: 1, height: 7, background: "var(--bg-surface-2)", borderRadius: 10, overflow: "hidden" }}>
                              <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, delay: 0.3, ease: "easeOut" }} style={{ height: "100%", background: `linear-gradient(90deg, ${cat.color}, ${cat.lightColor})`, borderRadius: 10 }} />
                            </div>
                            <div style={{ width: 56, textAlign: "right", flexShrink: 0 }}>
                              <span style={{ fontSize: 12, fontFamily: "'JetBrains Mono', monospace", color: "var(--text-secondary)", fontWeight: 600 }}>{count}</span>
                              <span style={{ fontSize: 11, color: "var(--text-faint)", marginLeft: 4 }}>({pct}%)</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="card" style={{ padding: "22px 24px" }}>
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginBottom: 18, display: "flex", alignItems: "center", gap: 8 }}>
                      <Activity style={{ width: 16, height: 16, color: "#059669" }} strokeWidth={2} />
                      Recent Uploads
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      {(stats?.recentUploads || []).map((f: MedicalFile, i: number) => {
                        const cat = getCategoryConfig(f.category);
                        return (
                          <motion.div key={f.id} initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{ width: 34, height: 34, borderRadius: 9, background: cat.bgColor, border: `1px solid ${cat.borderColor}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 13 }}>{cat.icon}</div>
                            <div style={{ minWidth: 0 }}>
                              <p style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.title}</p>
                              <p style={{ fontSize: 11, color: "var(--text-faint)" }}>{f.uploadedBy}</p>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} style={{ background: "linear-gradient(135deg, #EFF6FF 0%, #F0FDF4 100%)", border: "1px solid #BFDBFE", borderRadius: 16, padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
                  <div>
                    <p style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>Ready to upload new files?</p>
                    <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>Add medical images, PDFs, videos and more to the gallery</p>
                  </div>
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setUploadOpen(true)} className="btn-primary" style={{ padding: "11px 22px", fontSize: 14, flexShrink: 0 }}>
                    <Upload style={{ width: 15, height: 15 }} strokeWidth={2} />
                    Upload Now
                  </motion.button>
                </motion.div>
              </motion.div>
            )}

            {tab === "files" && (
              <motion.div key="files" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, gap: 12 }}>
                  <div>
                    <h1 className="font-serif" style={{ fontSize: "clamp(20px, 5vw, 26px)", color: "var(--text-primary)" }}>File Manager</h1>
                    <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 3 }}>{files.length} total files</p>
                  </div>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={() => setUploadOpen(true)} className="btn-primary" style={{ fontSize: 13, flexShrink: 0 }}>
                    <Plus style={{ width: 15, height: 15 }} strokeWidth={2.5} />
                    <span className="hide-mobile">Upload</span>
                  </motion.button>
                </div>
                <div className="card" style={{ padding: "16px 20px", marginBottom: 16 }}>
                  <div style={{ marginBottom: 14 }}><SearchBar value={search} onChange={setSearch} placeholder="Search files…" /></div>
                  <CategoryFilter selected={category} onChange={setCategory} counts={stats?.categoryCounts || {}} />
                </div>
                <div className="card" style={{ padding: "18px 20px" }}>
                  {loading ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 10, padding: "8px 0" }}>
                      {Array.from({ length: 5 }).map((_, i) => <div key={i} className="shimmer" style={{ height: 50, borderRadius: 10 }} />)}
                    </div>
                  ) : (
                    <FileTable files={filteredFiles} onDelete={handleDelete} onToggleVisibility={handleToggle} onRefresh={fetchAll} />
                  )}
                </div>
              </motion.div>
            )}

            {tab === "analytics" && (
              <motion.div key="analytics" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                <div style={{ marginBottom: 20 }}>
                  <h1 className="font-serif" style={{ fontSize: "clamp(20px, 5vw, 26px)", color: "var(--text-primary)" }}>Analytics</h1>
                  <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 3 }}>Gallery usage and file statistics</p>
                </div>
                <div className="admin-two-col">
                  <div className="card" style={{ padding: "22px 24px" }}>
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginBottom: 18, display: "flex", alignItems: "center", gap: 8 }}>
                      <TrendingUp style={{ width: 16, height: 16, color: "#0369A1" }} strokeWidth={2} />
                      Top Files by Views
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      {[...files].sort((a, b) => b.views - a.views).slice(0, 7).map((f, i) => {
                        const cat = getCategoryConfig(f.category);
                        const maxV = Math.max(...files.map((x) => x.views), 1);
                        return (
                          <div key={f.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "var(--text-faint)", width: 16, textAlign: "right", flexShrink: 0 }}>{i + 1}</span>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <p style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: 5 }}>{f.title}</p>
                              <div style={{ height: 5, background: "var(--bg-surface-2)", borderRadius: 4, overflow: "hidden" }}>
                                <motion.div initial={{ width: 0 }} animate={{ width: `${(f.views / maxV) * 100}%` }} transition={{ duration: 0.8, delay: i * 0.07, ease: "easeOut" }} style={{ height: "100%", background: `linear-gradient(90deg, ${cat.color}, ${cat.lightColor})`, borderRadius: 4 }} />
                              </div>
                            </div>
                            <span style={{ fontSize: 12, fontFamily: "'JetBrains Mono', monospace", color: "var(--text-secondary)", fontWeight: 600, width: 28, textAlign: "right", flexShrink: 0 }}>{f.views}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div className="card" style={{ padding: "22px 24px" }}>
                      <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginBottom: 18, display: "flex", alignItems: "center", gap: 8 }}>
                        <Files style={{ width: 16, height: 16, color: "#7C3AED" }} strokeWidth={2} />
                        File Type Distribution
                      </h3>
                      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {(["image", "pdf", "video", "dicom"] as const).map((type) => {
                          const count = files.filter((f) => f.fileType === type).length;
                          const pct = files.length ? Math.round((count / files.length) * 100) : 0;
                          const colors: Record<string, [string, string]> = { image: ["#0369A1", "#38BDF8"], pdf: ["#7C3AED", "#A78BFA"], video: ["#B45309", "#F59E0B"], dicom: ["#065F46", "#34D399"] };
                          return (
                            <div key={type}>
                              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 5 }}>
                                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{type}</span>
                                <span style={{ color: "var(--text-muted)" }}>{count} files ({pct}%)</span>
                              </div>
                              <div style={{ height: 7, background: "var(--bg-surface-2)", borderRadius: 10, overflow: "hidden" }}>
                                <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.9, ease: "easeOut" }} style={{ height: "100%", background: `linear-gradient(90deg, ${colors[type][0]}, ${colors[type][1]})`, borderRadius: 10 }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div className="card" style={{ padding: "22px 24px" }}>
                      <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                        <HardDrive style={{ width: 16, height: 16, color: "#B45309" }} strokeWidth={2} />
                        Storage by Category
                      </h3>
                      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                        {CATEGORIES.filter((c) => files.some((f) => f.category === c.id)).map((cat) => {
                          const storage = files.filter((f) => f.category === cat.id).reduce((a, f) => a + f.fileSize, 0);
                          return (
                            <div key={cat.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--bg-surface-2)" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5 }}>
                                <span style={{ width: 8, height: 8, borderRadius: "50%", background: cat.color, display: "inline-block", flexShrink: 0 }} />
                                <span style={{ color: "var(--text-secondary)" }}>{cat.label}</span>
                              </div>
                              <span style={{ fontSize: 12, fontFamily: "'JetBrains Mono', monospace", color: "var(--text-muted)", fontWeight: 500 }}>{formatFileSize(storage)}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      <nav className="mobile-tab-bar">
        {sidebarTabs.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setTab(id)} className={`mobile-tab-item ${tab === id ? "active" : ""}`}>
            <Icon style={{ width: 20, height: 20 }} strokeWidth={tab === id ? 2.2 : 1.8} />
            <span>{label === "File Manager" ? "Files" : label}</span>
          </button>
        ))}
        <button onClick={() => setUploadOpen(true)} className="mobile-tab-item">
          <Plus style={{ width: 20, height: 20 }} strokeWidth={1.8} />
          <span>Upload</span>
        </button>
      </nav>

      <UploadModal open={uploadOpen} onClose={() => setUploadOpen(false)} onSuccess={() => { fetchAll(); setUploadOpen(false); }} />
    </div>
  );
}