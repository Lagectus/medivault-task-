export type Category =
  | "radiology"
  | "pathology"
  | "dermatology"
  | "cardiology"
  | "neurology"
  | "ophthalmology"
  | "orthopedics"
  | "oncology"
  | "general";

export interface MedicalFile {
  id: string;
  title: string;
  description: string;
  category: Category;
  fileType: "image" | "pdf" | "dicom" | "video";
  fileName: string;
  fileSize: number;
  fileUrl: string;
  downloadUrl?: string;
  thumbnailUrl?: string;
  uploadedAt: string;
  uploadedBy: string;
  tags: string[];
  isPublic: boolean;
  views: number;
  patientId?: string;
}

export interface CategoryConfig {
  id: Category;
  label: string;
  color: string;
  lightColor: string;
  bgColor: string;
  borderColor: string;
  icon: string;
  description: string;
}

export interface AdminStats {
  totalFiles: number;
  totalViews: number;
  categoryCounts: Record<string, number>;
  recentUploads: MedicalFile[];
  storageUsed: number;
}