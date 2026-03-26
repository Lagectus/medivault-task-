import { NextRequest, NextResponse } from "next/server";
import { getAllFiles, addFile, deleteFile, updateFile, incrementViews } from "@/lib/store";
import { MedicalFile, Category } from "@/types";
import { v4 as uuidv4 } from "uuid";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const categoryParam = searchParams.get("category");
  const search = searchParams.get("search") || "";

  let files = getAllFiles();

  // ✅ Type-safe category filtering
  if (categoryParam && categoryParam !== "all") {
    const category = categoryParam as Category;
    files = files.filter((f) => f.category === category);
  }

  // ✅ Search filter
  if (search) {
    const q = search.toLowerCase();
    files = files.filter(
      (f) =>
        f.title.toLowerCase().includes(q) ||
        f.description.toLowerCase().includes(q) ||
        f.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  return NextResponse.json({ files, total: files.length });
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const title = formData.get("title") as string;
    const description = (formData.get("description") as string) || "";
    const category = formData.get("category") as Category;
    const tags = (formData.get("tags") as string || "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const isPublic = formData.get("isPublic") === "true";
    const uploadedBy = (formData.get("uploadedBy") as string) || "Admin";
    const patientId = formData.get("patientId") as string;
    const file = formData.get("file") as File | null;

    // ✅ Validation
    if (!title || !category) {
      return NextResponse.json(
        { error: "Title and category required" },
        { status: 400 }
      );
    }

    let fileType: MedicalFile["fileType"] = "image";
    let fileName = "no-file.png";
    let fileSize = 0;

    if (file) {
      fileName = file.name;
      fileSize = file.size;

      const ext = fileName.split(".").pop()?.toLowerCase();

      if (ext === "pdf") fileType = "pdf";
      else if (["mp4", "avi", "mov"].includes(ext || "")) fileType = "video";
      else if (ext === "dcm") fileType = "dicom";
      else fileType = "image";
    }

    const newFile: MedicalFile = {
      id: uuidv4(),
      title,
      description,
      category,
      fileType,
      fileName,
      fileSize,
      fileUrl: "/api/placeholder/800/600",
      thumbnailUrl: "/api/placeholder/400/300",
      uploadedAt: new Date().toISOString(),
      uploadedBy,
      tags,
      isPublic,
      views: 0,
      patientId: patientId || undefined,
    };

    addFile(newFile);

    return NextResponse.json({ file: newFile }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID required" }, { status: 400 });
  }

  const success = deleteFile(id);

  if (!success) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}

export async function PATCH(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const qid = searchParams.get("id");

  // ✅ Increment views
  if (qid) {
    incrementViews(qid);
    return NextResponse.json({ success: true });
  }

  const body = await request.json();
  const { id, ...updates } = body;

  if (!id) {
    return NextResponse.json({ error: "ID required" }, { status: 400 });
  }

  const updated = updateFile(id, updates);

  if (!updated) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  return NextResponse.json({ file: updated });
}