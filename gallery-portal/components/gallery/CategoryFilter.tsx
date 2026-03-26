"use client";
import { motion } from "framer-motion";
import { CATEGORIES } from "@/lib/categories";

interface CategoryFilterProps {
  selected: string;
  onChange: (cat: string) => void;
  counts?: Record<string, number>;
}

export default function CategoryFilter({
  selected,
  onChange,
  counts = {},
}: CategoryFilterProps) {
  const all = [
    { id: "all", label: "All Files", color: "#0369A1", lightColor: "#38BDF8", bgColor: "#EFF6FF", borderColor: "#BFDBFE" },
    ...CATEGORIES,
  ];

  const totalCount = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <div className="flex flex-wrap gap-2">
      {all.map((cat, i) => {
        const isActive = selected === cat.id;
        const count = cat.id === "all" ? totalCount : counts[cat.id] || 0;

        return (
          <motion.button
            key={cat.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03, duration: 0.3 }}
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onChange(cat.id)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 13px",
              borderRadius: 20,
              fontSize: 12.5,
              fontWeight: isActive ? 600 : 500,
              border: `1.5px solid ${isActive ? cat.color : "var(--border)"}`,
              background: isActive ? cat.bgColor : "var(--bg-surface)",
              color: isActive ? cat.color : "var(--text-muted)",
              cursor: "pointer",
              transition: "all 0.15s",
              boxShadow: isActive ? `0 2px 8px ${cat.color}22` : "none",
              fontFamily: "inherit",
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: isActive ? cat.color : "var(--border-strong)",
                display: "inline-block",
                transition: "background 0.15s",
              }}
            />
            {cat.label}
            {count > 0 && (
              <span
                style={{
                  fontSize: 10.5,
                  fontFamily: "'JetBrains Mono', monospace",
                  padding: "1px 6px",
                  borderRadius: 10,
                  background: isActive ? `${cat.color}18` : "var(--bg-surface-2)",
                  color: isActive ? cat.color : "var(--text-faint)",
                  fontWeight: 600,
                }}
              >
                {count}
              </span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}