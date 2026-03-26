"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  Images,
  LayoutDashboard,
  Shield,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { authAPI } from "@/lib/api";

const navItems = [
  { href: "/", label: "Gallery", icon: Images },
  { href: "/admin", label: "Admin", icon: LayoutDashboard },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [loggingOut, setLoggingOut] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const isAdmin = pathname.startsWith("/admin");

  const handleLogout = async () => {
    setLoggingOut(true);
    await authAPI.logout().catch(() => {});
    router.push("/admin/login");
  };

  return (
    <motion.nav
      initial={{ y: -72, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        padding: "10px",
      }}
    >
      <div
        style={{
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(20px)",
          border: "1px solid var(--border)",
          borderRadius: 14,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 16px",
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "var(--text-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Activity style={{ width: 16, height: 16, color: "white" }} />
          </div>

          <span style={{ fontSize: 16, fontWeight: 600 }}>
            MediVault
          </span>
        </Link>

        {/* ✅ Desktop Nav */}
        <div className="desktop-nav">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive =
              href === "/" ? pathname === "/" : pathname.startsWith(href);

            return (
              <Link key={href} href={href}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "6px 10px",
                    borderRadius: 8,
                    background: isActive ? "var(--bg-surface-2)" : "transparent",
                  }}
                >
                  <Icon size={14} />
                  {label}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Desktop badge */}
          <div className="hide-mobile" style={{ fontSize: 11 }}>
            <Shield size={12} /> Secure
          </div>

          {/* Logout */}
          {isAdmin && (
            <button onClick={handleLogout}>
              <LogOut size={16} />
            </button>
          )}

          {/* ✅ Mobile menu button */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* ✅ Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              marginTop: 10,
              background: "white",
              borderRadius: 12,
              padding: 12,
              border: "1px solid var(--border)",
              width: "100%",
            }}
          >
            {navItems.map(({ href, label }) => (
              <Link key={href} href={href} onClick={() => setMenuOpen(false)}>
                <div style={{ padding: "10px 0" }}>{label}</div>
              </Link>
            ))}

            {isAdmin && (
              <button onClick={handleLogout} style={{ marginTop: 10 }}>
                Logout
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}