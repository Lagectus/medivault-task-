"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search files, tags, descriptions...",
}: SearchBarProps) {
  const [focused, setFocused] = useState(false);

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        background: "var(--bg-surface)",
        border: `1.5px solid ${focused ? "var(--border-focus)" : "var(--border)"}`,
        borderRadius: 12,
        boxShadow: focused
          ? "0 0 0 3px rgba(3,105,161,0.1)"
          : "var(--shadow-card)",
        transition: "border-color 0.15s, box-shadow 0.15s",
        overflow: "hidden",
      }}
    >
      <Search
        style={{
          position: "absolute",
          left: 14,
          width: 16,
          height: 16,
          color: focused ? "var(--accent)" : "var(--text-faint)",
          transition: "color 0.15s",
          flexShrink: 0,
        }}
        strokeWidth={2}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        style={{
          width: "100%",
          padding: "11px 14px 11px 42px",
          background: "transparent",
          border: "none",
          outline: "none",
          fontSize: 14,
          color: "var(--text-primary)",
          fontFamily: "inherit",
        }}
      />
      <AnimatePresence>
        {value && (
          <motion.button
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.15 }}
            onClick={() => onChange("")}
            style={{
              position: "absolute",
              right: 12,
              width: 22,
              height: 22,
              borderRadius: "50%",
              background: "var(--bg-surface-3)",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--text-muted)",
            }}
          >
            <X style={{ width: 12, height: 12 }} strokeWidth={2.5} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}