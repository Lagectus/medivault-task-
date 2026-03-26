"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Eye, EyeOff, Activity, Lock, AlertCircle, Loader2, CheckCircle } from "lucide-react";
import { authAPI } from "@/lib/api";

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!form.username || !form.password) {
    setError("Username aur password dono required hain.");
    setStatus("error");
    return;
  }
  setStatus("loading");
  setError("");

  try {
    await authAPI.login(form.username, form.password);
    setStatus("success");
    setTimeout(() => router.push("/admin"), 800);
  } catch (err: any) {
    setStatus("error");
    setError(err.message || "Server se connect nahi ho pa raha.");
  }
};

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
      {/* Background blobs */}
      <div style={{ position: "absolute", top: -120, right: -120, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, #BFDBFE 0%, transparent 70%)", opacity: 0.5 }} />
      <div style={{ position: "absolute", bottom: -80, left: -80, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, #A7F3D0 0%, transparent 70%)", opacity: 0.4 }} />
      <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(circle, #E2E8F0 1px, transparent 1px)`, backgroundSize: "28px 28px", opacity: 0.5 }} />

      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ position: "relative", width: "100%", maxWidth: 420, margin: "0 20px" }}
      >
        <div className="card" style={{ padding: "40px 36px", boxShadow: "0 20px 60px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.04)" }}>
          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              style={{ display: "inline-flex", marginBottom: 18 }}
            >
              <div style={{ width: 56, height: 56, borderRadius: 16, background: "var(--text-primary)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px rgba(0,0,0,0.15)" }}>
                <Activity style={{ width: 28, height: 28, color: "white" }} strokeWidth={2} />
              </div>
            </motion.div>

            <h1 className="font-serif" style={{ fontSize: 28, color: "var(--text-primary)", marginBottom: 6 }}>MediVault</h1>
            <p style={{ fontSize: 12, fontFamily: "'JetBrains Mono', monospace", color: "var(--text-faint)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
              Admin Portal
            </p>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 16, padding: "6px 14px", borderRadius: 20, background: "#EFF6FF", border: "1px solid #BFDBFE" }}>
              <Shield style={{ width: 12, height: 12, color: "#1E40AF" }} strokeWidth={2} />
              <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "#1E40AF", letterSpacing: "0.06em" }}>SECURE ACCESS</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Username */}
            <div>
              <label style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: "0.09em", color: "var(--text-muted)", display: "block", marginBottom: 7 }}>
                Username
              </label>
              <div style={{ position: "relative" }}>
                <Lock style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", width: 15, height: 15, color: "var(--text-faint)" }} strokeWidth={2} />
                <input
                  type="text"
                  value={form.username}
                  onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
                  className="input"
                  placeholder="admin"
                  style={{ paddingLeft: 38 }}
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: "0.09em", color: "var(--text-muted)", display: "block", marginBottom: 7 }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <Lock style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", width: 15, height: 15, color: "var(--text-faint)" }} strokeWidth={2} />
                <input
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  className="input"
                  placeholder="••••••••"
                  style={{ paddingLeft: 38, paddingRight: 44 }}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((p) => !p)}
                  style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex", padding: 4 }}
                >
                  {showPass
                    ? <EyeOff style={{ width: 15, height: 15 }} strokeWidth={2} />
                    : <Eye    style={{ width: 15, height: 15 }} strokeWidth={2} />
                  }
                </button>
              </div>
            </div>

            {/* Error */}
            <AnimatePresence>
              {status === "error" && error && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                  style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderRadius: 10, background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626", fontSize: 13 }}
                >
                  <AlertCircle style={{ width: 15, height: 15, flexShrink: 0 }} strokeWidth={2} />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <motion.button
              type="submit"
              whileHover={{ scale: status === "idle" || status === "error" ? 1.01 : 1 }}
              whileTap={{ scale: status === "idle" || status === "error" ? 0.98 : 1 }}
              disabled={status === "loading" || status === "success"}
              className="btn-primary"
              style={{ width: "100%", justifyContent: "center", padding: "13px 0", fontSize: 15, marginTop: 4, background: status === "success" ? "#059669" : "var(--text-primary)", opacity: status === "loading" ? 0.8 : 1 }}
            >
              {status === "loading" && <Loader2 style={{ width: 17, height: 17, animation: "spin 1s linear infinite" }} />}
              {status === "success" && <CheckCircle style={{ width: 17, height: 17 }} />}
              {(status === "idle" || status === "error") && <Shield style={{ width: 17, height: 17 }} strokeWidth={2} />}
              {status === "loading" ? "Verifying..." : status === "success" ? "Access Granted!" : "Login to Admin"}
            </motion.button>
          </form>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 16, fontSize: 11.5, color: "var(--text-faint)" }}>
          <Shield style={{ width: 12, height: 12, color: "var(--success)" }} strokeWidth={2} />
          <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>HIPAA Compliant System</span>
        </div>
      </motion.div>
    </div>
  );
}