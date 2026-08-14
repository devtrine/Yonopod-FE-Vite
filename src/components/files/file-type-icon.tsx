import {
  FileText,
  FileSpreadsheet,
  FileImage,
  FileVideo,
  FileArchive,
  File,
  Folder,
  FileCode,
  Presentation,
} from "lucide-react";

const EXT_MAP: Record<string, { icon: React.ElementType; color: string }> = {
  pdf: { icon: FileText, color: "text-[#ef4444]" },
  doc: { icon: FileText, color: "text-[#2563eb]" },
  docx: { icon: FileText, color: "text-[#2563eb]" },
  xls: { icon: FileSpreadsheet, color: "text-[#16a34a]" },
  xlsx: { icon: FileSpreadsheet, color: "text-[#16a34a]" },
  csv: { icon: FileSpreadsheet, color: "text-[#16a34a]" },
  png: { icon: FileImage, color: "text-[#9333ea]" },
  jpg: { icon: FileImage, color: "text-[#9333ea]" },
  jpeg: { icon: FileImage, color: "text-[#9333ea]" },
  gif: { icon: FileImage, color: "text-[#9333ea]" },
  webp: { icon: FileImage, color: "text-[#9333ea]" },
  mp4: { icon: FileVideo, color: "text-[#0891b2]" },
  mov: { icon: FileVideo, color: "text-[#0891b2]" },
  avi: { icon: FileVideo, color: "text-[#0891b2]" },
  webm: {icon: FileVideo, color: "text-[#0891b2]"},
  zip: { icon: FileArchive, color: "text-[#d97706]" },
  rar: { icon: FileArchive, color: "text-[#d97706]" },
  fig: { icon: FileCode, color: "text-[#7c3aed]" },
  pptx: { icon: Presentation, color: "text-[#ea580c]" },
  ppt: { icon: Presentation, color: "text-[#ea580c]" },
};

export function FileTypeIcon({
  name,
  isFolder = false,
  size = 20,
  className = "",
}: {
  name: string;
  isFolder?: boolean;
  size?: number;
  className?: string;
}) {
  if (isFolder) {
    return <Folder size={size} className={["text-[#1c3fc4]", className].join(" ")} />;
  }

  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  const match = EXT_MAP[ext];

  if (match) {
    const Icon = match.icon;
    return <Icon size={size} className={[match.color, className].join(" ")} />;
  }

  return <File size={size} className={["text-[#94a3b8]", className].join(" ")} />;
}
