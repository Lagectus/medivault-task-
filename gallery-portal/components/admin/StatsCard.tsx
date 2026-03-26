"use client";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  borderColor: string;
  trend?: string;
  index?: number;
}

export default function StatsCard({
  label,
  value,
  icon: Icon,
  color,
  bgColor,
  borderColor,
  trend,
  index = 0,
}: StatsCardProps) {
  const valueRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (typeof value === "number" && valueRef.current) {
      gsap.fromTo(
        valueRef.current,
        { innerText: 0 },
        {
          innerText: value,
          duration: 1.4,
          ease: "power2.out",
          delay: index * 0.1 + 0.3,
          snap: { innerText: 1 },
          onUpdate() {
            if (valueRef.current) {
              valueRef.current.innerText = Math.round(
                parseFloat(valueRef.current.innerText)
              ).toLocaleString();
            }
          },
        }
      );
    }
  }, [value, index]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="card"
      style={{ padding: "20px 22px", position: "relative", overflow: "hidden" }}
    >
      {/* Top accent bar */}
      <div
        style={{
          position: "absolute",
          top: 0, left: 0, right: 0,
          height: 3,
          background: `linear-gradient(90deg, ${color}, ${color}55)`,
          borderRadius: "16px 16px 0 0",
        }}
      />

      {/* Bg glow */}
      <div
        style={{
          position: "absolute",
          top: -20, right: -20,
          width: 80, height: 80,
          borderRadius: "50%",
          background: color,
          opacity: 0.06,
          filter: "blur(20px)",
        }}
      />

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", position: "relative" }}>
        <div>
          <p
            style={{
              fontSize: 10.5,
              fontFamily: "'JetBrains Mono', monospace",
              textTransform: "uppercase",
              letterSpacing: "0.09em",
              color: "var(--text-muted)",
              marginBottom: 10,
            }}
          >
            {label}
          </p>
          <p
            className="font-serif"
            style={{ fontSize: 32, color: "var(--text-primary)", lineHeight: 1, marginBottom: 4 }}
          >
            {typeof value === "number" ? (
              <span ref={valueRef}>0</span>
            ) : (
              <span>{value}</span>
            )}
          </p>
          {trend && (
            <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 6 }}>{trend}</p>
          )}
        </div>
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            background: bgColor,
            border: `1px solid ${borderColor}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Icon style={{ width: 20, height: 20, color }} strokeWidth={1.8} />
        </div>
      </div>
    </motion.div>
  );
}