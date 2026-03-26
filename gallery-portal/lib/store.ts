import { MedicalFile, Category } from "@/types";

let files: MedicalFile[] = [
  {
    id: "1",
    title: "Chest X-Ray – Pneumonia Case",
    description:
      "Right lower lobe consolidation consistent with bacterial pneumonia. Elevated WBC count with neutrophilia. Patient requires immediate antibiotic therapy.",
    category: "radiology",
    fileType: "image",
    fileName: "chest_xray_001.png",
    fileSize: 2457600,
    fileUrl: "/api/placeholder/800/600",
    uploadedAt: "2024-03-15T10:30:00Z",
    uploadedBy: "Dr. Sarah Mitchell",
    tags: ["pneumonia", "chest", "x-ray", "respiratory"],
    isPublic: true,
    views: 142,
    patientId: "P-2024-001",
  },
  {
    id: "2",
    title: "Brain MRI – Glioblastoma",
    description:
      "T1 post-contrast MRI showing ring-enhancing lesion in right temporal lobe. Surrounding edema noted. Biopsy recommended for definitive diagnosis.",
    category: "neurology",
    fileType: "image",
    fileName: "brain_mri_002.png",
    fileSize: 5242880,
    fileUrl: "/api/placeholder/800/600",
    uploadedAt: "2024-03-14T14:15:00Z",
    uploadedBy: "Dr. James Chen",
    tags: ["brain", "mri", "tumor", "neurology"],
    isPublic: true,
    views: 89,
    patientId: "P-2024-015",
  },
  {
    id: "3",
    title: "ECG – Atrial Fibrillation",
    description:
      "12-lead ECG demonstrating irregular rhythm without distinct P waves. Ventricular rate approximately 110 bpm. Rate control and anticoagulation initiated.",
    category: "cardiology",
    fileType: "image",
    fileName: "ecg_afib_003.png",
    fileSize: 1048576,
    fileUrl: "/api/placeholder/800/600",
    uploadedAt: "2024-03-13T09:00:00Z",
    uploadedBy: "Dr. Priya Sharma",
    tags: ["ecg", "atrial-fibrillation", "heart", "arrhythmia"],
    isPublic: true,
    views: 203,
    patientId: "P-2024-022",
  },
  {
    id: "4",
    title: "Skin Lesion – Melanoma Stage II",
    description:
      "Dermoscopic image showing asymmetric lesion with irregular borders and varied pigmentation. Breslow thickness 1.8mm. Wide local excision recommended.",
    category: "dermatology",
    fileType: "image",
    fileName: "melanoma_stage2_004.png",
    fileSize: 3145728,
    fileUrl: "/api/placeholder/800/600",
    uploadedAt: "2024-03-12T11:45:00Z",
    uploadedBy: "Dr. Emma Rodriguez",
    tags: ["melanoma", "skin", "dermoscopy", "oncology"],
    isPublic: true,
    views: 167,
    patientId: "P-2024-031",
  },
  {
    id: "5",
    title: "Retinal Scan – Diabetic Retinopathy",
    description:
      "Fundus photograph showing moderate non-proliferative diabetic retinopathy with microaneurysms and hard exudates in both eyes.",
    category: "ophthalmology",
    fileType: "image",
    fileName: "retinal_scan_005.png",
    fileSize: 4194304,
    fileUrl: "/api/placeholder/800/600",
    uploadedAt: "2024-03-11T16:20:00Z",
    uploadedBy: "Dr. Michael Park",
    tags: ["retina", "diabetic-retinopathy", "fundus", "eye"],
    isPublic: true,
    views: 95,
    patientId: "P-2024-044",
  },
  {
    id: "6",
    title: "Knee MRI – ACL Tear",
    description:
      "Sagittal MRI demonstrating complete ACL rupture with bone contusion of lateral femoral condyle and tibial plateau. Surgical reconstruction advised.",
    category: "orthopedics",
    fileType: "image",
    fileName: "knee_mri_acl_006.png",
    fileSize: 3670016,
    fileUrl: "/api/placeholder/800/600",
    uploadedAt: "2024-03-10T13:00:00Z",
    uploadedBy: "Dr. Lisa Thompson",
    tags: ["knee", "acl", "mri", "sports-injury"],
    isPublic: true,
    views: 128,
    patientId: "P-2024-057",
  },
  {
    id: "7",
    title: "Histology – Adenocarcinoma Colon",
    description:
      "H&E stained slide showing well-differentiated adenocarcinoma of the colon with glandular formations and stromal invasion. pT3N1M0.",
    category: "pathology",
    fileType: "image",
    fileName: "histology_adeno_007.png",
    fileSize: 6291456,
    fileUrl: "/api/placeholder/800/600",
    uploadedAt: "2024-03-09T10:00:00Z",
    uploadedBy: "Dr. Robert Kim",
    tags: ["histology", "cancer", "colon", "adenocarcinoma"],
    isPublic: false,
    views: 54,
    patientId: "P-2024-063",
  },
  {
    id: "8",
    title: "PET Scan – Lung Cancer Staging",
    description:
      "FDG-PET scan showing increased uptake in right upper lobe (SUVmax 8.4) consistent with primary malignancy. Mediastinal nodes negative.",
    category: "oncology",
    fileType: "dicom",
    fileName: "pet_lung_008.dcm",
    fileSize: 8388608,
    fileUrl: "/api/placeholder/800/600",
    uploadedAt: "2024-03-08T08:30:00Z",
    uploadedBy: "Dr. Anna Lee",
    tags: ["pet", "lung", "staging", "fdg"],
    isPublic: true,
    views: 311,
    patientId: "P-2024-071",
  },
];

export function getAllFiles(): MedicalFile[] {
  return [...files].sort(
    (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
  );
}

export function getFilesByCategory(category: Category): MedicalFile[] {
  return files.filter((f) => f.category === category);
}

export function getFileById(id: string): MedicalFile | undefined {
  return files.find((f) => f.id === id);
}

export function addFile(file: MedicalFile): void {
  files.unshift(file);
}

export function updateFile(
  id: string,
  updates: Partial<MedicalFile>
): MedicalFile | null {
  const idx = files.findIndex((f) => f.id === id);
  if (idx === -1) return null;
  files[idx] = { ...files[idx], ...updates };
  return files[idx];
}

export function deleteFile(id: string): boolean {
  const len = files.length;
  files = files.filter((f) => f.id !== id);
  return files.length < len;
}

export function incrementViews(id: string): void {
  const file = files.find((f) => f.id === id);
  if (file) file.views += 1;
}

export function getStats() {
  const categoryCounts: Record<string, number> = {};
  files.forEach((f) => {
    categoryCounts[f.category] = (categoryCounts[f.category] || 0) + 1;
  });
  return {
    totalFiles: files.length,
    totalViews: files.reduce((acc, f) => acc + f.views, 0),
    categoryCounts,
    recentUploads: [...files]
      .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
      .slice(0, 5),
    storageUsed: files.reduce((acc, f) => acc + f.fileSize, 0),
  };
}