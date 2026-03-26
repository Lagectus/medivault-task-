"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Activity, Grid3X3, List, Sparkles, RefreshCw, ArrowDown } from "lucide-react";
import Navbar from "@/components/Navbar";
import FileCard from "@/components/gallery/FileCard";
import FileModal from "@/components/gallery/FileModal";
import CategoryFilter from "@/components/gallery/CategoryFilter";
import SearchBar from "@/components/gallery/SearchBar";
import { MedicalFile } from "@/types";
import { filesAPI, statsAPI } from "@/lib/api"; // ← Express backend ke liye

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function GalleryPage() {
  const [files, setFiles]       = useState<MedicalFile[]>([]);
  const [filtered, setFiltered] = useState<MedicalFile[]>([]);
  const [category, setCategory] = useState("all");
  const [search, setSearch]     = useState("");
  const [selected, setSelected] = useState<MedicalFile | null>(null);
  const [loading, setLoading]   = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [counts, setCounts]     = useState<Record<string, number>>({});

  const heroRef     = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef      = useRef<HTMLParagraphElement>(null);
  const statsRef    = useRef<HTMLDivElement>(null);

  // ── Express backend se files fetch karo ──
  const fetchFiles = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await filesAPI.getAll();
      const data = await res.json();
      const all: MedicalFile[] = data.files || [];
      // Gallery mein sirf public files dikhao
      const publicFiles = all.filter((f) => f.isPublic);
      setFiles(publicFiles);
    } catch (err) {
      console.error("Files fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Express backend se stats fetch karo ──
  const fetchStats = useCallback(async () => {
    try {
      const res  = await statsAPI.get();
      const data = await res.json();
      setCounts(data.categoryCounts || {});
    } catch (err) {
      console.error("Stats fetch error:", err);
    }
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);
  useEffect(() => { fetchFiles(); }, [fetchFiles]);

  // ── Frontend filtering — category aur search ──
  useEffect(() => {
    let result = [...files];
    if (category !== "all") {
      result = result.filter((f) => f.category === category);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (f) =>
          f.title.toLowerCase().includes(q) ||
          f.description?.toLowerCase().includes(q) ||
          f.tags.some((t) => t.includes(q))
      );
    }
    setFiltered(result);
  }, [files, category, search]);

  // ── GSAP hero animations ──
  useEffect(() => {
    if (!headlineRef.current || !subRef.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.3 });
      tl.fromTo(headlineRef.current,
        { opacity: 0, y: 48, skewY: 2 },
        { opacity: 1, y: 0, skewY: 0, duration: 1, ease: "power4.out" }
      ).fromTo(subRef.current,
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, "-=0.5"
      );
      if (statsRef.current) {
        gsap.fromTo(
          Array.from(statsRef.current.children),
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, stagger: 0.1, duration: 0.5, ease: "power2.out", delay: 0.9 }
        );
      }
    }, heroRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!heroRef.current) return;
    const ctx = gsap.context(() => {
      gsap.to(".hero-orb", {
        yPercent: -30,
        ease: "none",
        scrollTrigger: { trigger: heroRef.current, start: "top top", end: "bottom top", scrub: 1 },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)" }}>
      <Navbar />

      {/* ── Hero ── */}
      <div ref={heroRef} className="bg-dot" style={{ position: "relative", paddingTop: 120, paddingBottom: 64, overflow: "hidden" }}>
        <div className="hero-orb" style={{ position: "absolute", top: -80, left: "12%", width: 520, height: 520, borderRadius: "50%", background: "radial-gradient(circle, #BAE6FD 0%, transparent 68%)", opacity: 0.55, pointerEvents: "none" }} />
        <div className="hero-orb" style={{ position: "absolute", top: 30, right: "8%", width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle, #DDD6FE 0%, transparent 68%)", opacity: 0.4, pointerEvents: "none" }} />

        <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center", padding: "0 24px", position: "relative", zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "6px 16px", borderRadius: 20, background: "white", border: "1px solid var(--border)", boxShadow: "var(--shadow-card)", fontSize: 12, color: "var(--text-secondary)", marginBottom: 28, fontWeight: 500 }}
          >
            <Sparkles style={{ width: 13, height: 13, color: "#0369A1" }} strokeWidth={2} />
            Secure Medical Image Repository
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#059669", display: "inline-block" }} />
          </motion.div>

          <h1
            ref={headlineRef}
            className="font-serif"
            style={{ fontSize: 58, lineHeight: 1.1, color: "var(--text-primary)", marginBottom: 18, opacity: 0, letterSpacing: "-0.02em" }}
          >
            Medical <span className="gradient-text">Gallery</span>
            <br />
            <span style={{ color: "var(--text-muted)", fontSize: 44, fontStyle: "italic" }}>Portal</span>
          </h1>

          <p ref={subRef} style={{ fontSize: 16, color: "var(--text-muted)", lineHeight: 1.7, maxWidth: 460, margin: "0 auto 36px", opacity: 0 }}>
            Browse, search, and manage medical imaging files across all clinical departments with confidence.
          </p>

          <div ref={statsRef} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            {[
              { label: "Total Files",  value: files.length },
              { label: "Departments", value: Object.keys(counts).length },
              { label: "Categories",  value: Object.keys(counts).length },
            ].map(({ label, value }, i) => (
              <div key={label} style={{ textAlign: "center", padding: "0 32px", opacity: 0, borderRight: i < 2 ? "1px solid var(--border)" : "none" }}>
                <div className="font-serif gradient-text" style={{ fontSize: 38, lineHeight: 1 }}>{value}</div>
                <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-faint)", marginTop: 5 }}>
                  {label}
                </div>
              </div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} style={{ marginTop: 44 }}>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 4, color: "var(--text-faint)", fontSize: 10.5, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: "0.1em" }}
            >
              <ArrowDown style={{ width: 14, height: 14 }} strokeWidth={2} />
              Scroll
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ── Main content ── */}
      <div style={{ maxWidth: 1360, margin: "0 auto", padding: "0 24px 80px" }}>

        {/* Filter card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="card"
          style={{ padding: "18px 22px", marginBottom: 22 }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
            <div style={{ flex: 1, minWidth: 240 }}>
              <SearchBar value={search} onChange={setSearch} />
            </div>
            <div style={{ display: "flex", gap: 6, marginLeft: "auto" }}>
              {([
                { mode: "grid" as const, Icon: Grid3X3 },
                { mode: "list" as const, Icon: List },
              ]).map(({ mode, Icon }) => (
                <motion.button
                  key={mode}
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode(mode)}
                  style={{ width: 36, height: 36, borderRadius: 9, background: viewMode === mode ? "var(--text-primary)" : "var(--bg-surface-2)", border: `1px solid ${viewMode === mode ? "var(--text-primary)" : "var(--border)"}`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: viewMode === mode ? "white" : "var(--text-muted)", transition: "all 0.15s" }}
                >
                  <Icon style={{ width: 15, height: 15 }} strokeWidth={2} />
                </motion.button>
              ))}
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={fetchFiles}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "0 14px", height: 36, borderRadius: 9, background: "var(--bg-surface-2)", border: "1px solid var(--border)", cursor: "pointer", fontSize: 12.5, color: "var(--text-muted)", fontFamily: "inherit", fontWeight: 500 }}
              >
                <RefreshCw style={{ width: 13, height: 13 }} strokeWidth={2} />
                Refresh
              </motion.button>
            </div>
          </div>
          <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--bg-surface-2)" }}>
            <CategoryFilter selected={category} onChange={setCategory} counts={counts} />
          </div>
        </motion.div>

        {/* Results info */}
        <div style={{ marginBottom: 18 }}>
          <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
            {loading ? "Loading…" : (
              <>
                <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>{filtered.length}</span>
                {" "}file{filtered.length !== 1 ? "s" : ""} found
                {category !== "all" && <span style={{ color: "var(--text-faint)" }}> in {category}</span>}
                {search && <span style={{ color: "var(--text-faint)" }}> matching "{search}"</span>}
              </>
            )}
          </p>
        </div>

        {/* Loading */}
        {loading ? (
          <div style={{ display: "grid", gap: 20, gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="card" style={{ overflow: "hidden" }}>
                <div className="shimmer" style={{ aspectRatio: "4/3" }} />
                <div style={{ padding: 18 }}>
                  <div className="shimmer" style={{ height: 16, borderRadius: 6, marginBottom: 8, width: "70%" }} />
                  <div className="shimmer" style={{ height: 12, borderRadius: 6, marginBottom: 6 }} />
                  <div className="shimmer" style={{ height: 12, borderRadius: 6, width: "55%" }} />
                </div>
              </div>
            ))}
          </div>

        /* Empty */
        ) : filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", padding: "80px 20px" }}>
            <div style={{ width: 72, height: 72, borderRadius: 20, background: "var(--bg-surface)", border: "1px solid var(--border)", boxShadow: "var(--shadow-card)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}>
              <Activity style={{ width: 30, height: 30, color: "var(--text-faint)" }} strokeWidth={1.5} />
            </div>
            <p className="font-serif" style={{ fontSize: 22, color: "var(--text-secondary)", marginBottom: 8 }}>
              {files.length === 0 ? "Koi files nahi hain abhi" : "No files found"}
            </p>
            <p style={{ fontSize: 14, color: "var(--text-muted)" }}>
              {files.length === 0
                ? "Admin se files upload karwao gallery mein dikhne ke liye"
                : "Try adjusting your search or category filter"}
            </p>
          </motion.div>

        /* Grid */
        ) : (
          <motion.div
            layout
            style={{ display: "grid", gap: 20, gridTemplateColumns: viewMode === "grid" ? "repeat(auto-fill, minmax(260px, 1fr))" : "1fr" }}
          >
            <AnimatePresence>
              {filtered.map((file, i) => (
                <FileCard key={file.id} file={file} index={i} onClick={setSelected} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {selected && <FileModal file={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </div>
  );
}