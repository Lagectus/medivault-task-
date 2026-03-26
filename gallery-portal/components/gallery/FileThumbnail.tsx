"use client";

import { MedicalFile } from "@/types";
import { getCategoryConfig } from "@/lib/categories";
import Image from "next/image";
import { FileText, Film, Zap, ImageIcon } from "lucide-react";

interface FileThumbnailProps {
  file: MedicalFile;
  size?: number;
  className?: string;
}

export default function FileThumbnail({ file, size = 400, className = "" }: FileThumbnailProps) {
  const cat = getCategoryConfig(file.category);

  const isImage = file.fileType === "image";
  const isPDF   = file.fileType === "pdf";
  const isVideo = file.fileType === "video";
  const isDicom = file.fileType === "dicom";

  if (isImage && file.fileUrl) {
    return (
      <div
        className={className}
        style={{ position: "relative", width: "100%", height: 200, overflow: "hidden", background: cat.bgColor, flexShrink: 0 }}
      >
        <Image
          src={file.fileUrl}
          alt={file.title ?? file.fileName ?? "Medical image"}
          fill
          style={{ objectFit: "cover" }}
          sizes={`${size}px`}
        />
      </div>
    );
  }

  return (
    <div
      className={className}
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        background: cat?.bgColor ?? "#F4F3F0",
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(255,255,255,0.7)",
          border: `1.5px solid ${cat?.borderColor ?? "#E8E6E1"}`,
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        }}
      >
        {isPDF  && <FileText  style={{ width: 28, height: 28, color: cat?.color ?? "#8C8C8C" }} strokeWidth={1.5} />}
        {isVideo && <Film      style={{ width: 28, height: 28, color: cat?.color ?? "#8C8C8C" }} strokeWidth={1.5} />}
        {isDicom && <Zap       style={{ width: 28, height: 28, color: cat?.color ?? "#8C8C8C" }} strokeWidth={1.5} />}
        {!isPDF && !isVideo && !isDicom && (
          <ImageIcon style={{ width: 28, height: 28, color: cat?.color ?? "#8C8C8C" }} strokeWidth={1.5} />
        )}
      </div>

      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: cat?.color ?? "#8C8C8C", marginBottom: 2 }}>
          {file.fileType}
        </div>
        {file.fileName && (
          <div style={{ fontSize: 10.5, color: "#C0BDB8", fontFamily: "'JetBrains Mono', monospace", maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {file.fileName}
          </div>
        )}
      </div>
    </div>
  );
}