"use client";

import { useState } from "react";
import Icon from "@/components/ui/Icon";

export type EvidenceMeta = {
  url: string;
  fileId?: number;
  name?: string;
  size?: number;
};

export const formatFileSize = (bytes?: number) => {
  if (bytes === undefined) return "";
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
};

interface EvidenceCardProps {
  url: string;
  name?: string;
  size?: string;
  label?: string;
  onRemove?: () => void;
}

export default function EvidenceCard({
  url,
  name,
  size,
  label,
  onRemove,
}: EvidenceCardProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadFile = async () => {
    if (!url || isDownloading) return;
    setIsDownloading(true);
    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Failed to download: ${res.status}`);
      }
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);

      const baseName = (name || label || "evidence").trim();
      const hasExtension = /\.[a-z0-9]+$/i.test(baseName);
      const isPdf = blob.type === "application/pdf" || baseName.toLowerCase().endsWith(".pdf");
      const filename = !hasExtension && isPdf ? `${baseName}.pdf` : baseName;

      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = filename || "evidence.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(objectUrl);
    } catch {
      window.open(url, "_blank", "noopener,noreferrer");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md bg-[#04A0EF]/5 hover:bg-[#04A0EF]/10 transition-colors">
      <Icon name="picture_as_pdf" size={20} className="text-red-500 shrink-0" />
      <div className="flex-1 text-sm text-gray-700 truncate">
        <span className="font-medium">{name || label || "Tệp đính kèm"}</span>
        {size && <span className="block text-xs text-gray-500">{size}</span>}
      </div>
      <button
        type="button"
        onClick={downloadFile}
        disabled={isDownloading}
        className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
      >
        <Icon name={isDownloading ? "hourglass_top" : "download"} size={18} />
      </button>
      {onRemove && (
        <button onClick={onRemove} className="text-gray-500 hover:text-gray-700">
          <Icon name="close" size={18} />
        </button>
      )}
    </div>
  );
}
