import { CategoryConfig, Category } from "@/types";

export const CATEGORIES: CategoryConfig[] = [
  {
    id: "radiology",
    label: "Radiology",
    color: "#0369A1",
    lightColor: "#38BDF8",
    bgColor: "#F0F9FF",
    borderColor: "#BAE6FD",
    icon: "🔬",
    description: "X-rays, CT scans, MRI images",
  },
  {
    id: "pathology",
    label: "Pathology",
    color: "#7C3AED",
    lightColor: "#A78BFA",
    bgColor: "#F5F3FF",
    borderColor: "#DDD6FE",
    icon: "🧫",
    description: "Histology and cytology slides",
  },
  {
    id: "dermatology",
    label: "Dermatology",
    color: "#B45309",
    lightColor: "#F59E0B",
    bgColor: "#FFFBEB",
    borderColor: "#FDE68A",
    icon: "🩺",
    description: "Skin conditions and dermoscopy",
  },
  {
    id: "cardiology",
    label: "Cardiology",
    color: "#BE123C",
    lightColor: "#FB7185",
    bgColor: "#FFF1F2",
    borderColor: "#FECDD3",
    icon: "❤️",
    description: "ECG, echocardiograms, angiography",
  },
  {
    id: "neurology",
    label: "Neurology",
    color: "#065F46",
    lightColor: "#34D399",
    bgColor: "#ECFDF5",
    borderColor: "#A7F3D0",
    icon: "🧠",
    description: "Brain and spine imaging",
  },
  {
    id: "ophthalmology",
    label: "Ophthalmology",
    color: "#1E40AF",
    lightColor: "#60A5FA",
    bgColor: "#EFF6FF",
    borderColor: "#BFDBFE",
    icon: "👁️",
    description: "Retinal scans, fundus photos",
  },
  {
    id: "orthopedics",
    label: "Orthopedics",
    color: "#9A3412",
    lightColor: "#FB923C",
    bgColor: "#FFF7ED",
    borderColor: "#FED7AA",
    icon: "🦴",
    description: "Bone and joint imaging",
  },
  {
    id: "oncology",
    label: "Oncology",
    color: "#86198F",
    lightColor: "#E879F9",
    bgColor: "#FDF4FF",
    borderColor: "#F0ABFC",
    icon: "🔭",
    description: "Tumor imaging and pathology",
  },
  {
    id: "general",
    label: "General",
    color: "#374151",
    lightColor: "#9CA3AF",
    bgColor: "#F9FAFB",
    borderColor: "#E5E7EB",
    icon: "📋",
    description: "General medical files",
  },
];

export function getCategoryConfig(id: string): CategoryConfig {
  return CATEGORIES.find((c) => c.id === id) || CATEGORIES[8];
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024)
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}