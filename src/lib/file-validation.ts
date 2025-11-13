import type { FileCategory, SupportedFileType } from "./types";

export const FILE_TYPE_MAP: Record<SupportedFileType, FileCategory> = {
  "image/png": "image",
  "image/jpeg": "image",
  "image/gif": "image",
  "image/webp": "image",
  "image/svg+xml": "image",
  "audio/mpeg": "audio",
  "audio/wav": "audio",
  "audio/flac": "audio",
  "audio/mp4": "audio",
  "audio/ogg": "audio",
  "video/mp4": "video",
  "video/webm": "video",
  "video/quicktime": "video",
  "video/x-msvideo": "video",
  "model/gltf-binary": "model",
  "model/gltf+json": "model",
  "application/octet-stream": "model",
  "application/pdf": "document",
  "text/html": "document",
  "text/plain": "document",
  "application/zip": "archive",
  "application/x-7z-compressed": "archive",
};

export const FILE_SIZE_LIMITS: Record<FileCategory, number> = {
  image: 50 * 1024 * 1024,
  audio: 100 * 1024 * 1024,
  video: 500 * 1024 * 1024,
  model: 200 * 1024 * 1024,
  document: 10 * 1024 * 1024,
  archive: 100 * 1024 * 1024,
};

export function isValidFileType(
  mimeType: string,
): mimeType is SupportedFileType {
  return mimeType in FILE_TYPE_MAP;
}

export function getFileCategory(mimeType: string): FileCategory | null {
  if (isValidFileType(mimeType)) {
    return FILE_TYPE_MAP[mimeType];
  }
  return null;
}

export function isValidFileSize(file: File): boolean {
  const category = getFileCategory(file.type);
  if (!category) return false;

  return file.size <= FILE_SIZE_LIMITS[category];
}

export function getFileExtension(mimeType: string): string {
  const extensionMap: Record<string, string> = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/gif": "gif",
    "image/webp": "webp",
    "image/svg+xml": "svg",
    "audio/mpeg": "mp3",
    "audio/wav": "wav",
    "audio/flac": "flac",
    "audio/mp4": "m4a",
    "audio/ogg": "ogg",
    "video/mp4": "mp4",
    "video/webm": "webm",
    "video/quicktime": "mov",
    "video/x-msvideo": "avi",
    "model/gltf-binary": "glb",
    "model/gltf+json": "gltf",
    "application/octet-stream": "obj",
    "application/pdf": "pdf",
    "text/html": "html",
    "text/plain": "txt",
    "application/zip": "zip",
    "application/x-7z-compressed": "7z",
  };

  return extensionMap[mimeType] || "bin";
}

export function validateFile(file: File): { valid: boolean; error?: string } {
  if (!file) {
    return {
      valid: false,
      error: "No file provided",
    };
  }

  if (file.size === 0) {
    return {
      valid: false,
      error: "File is empty",
    };
  }

  if (!file.name || file.name.trim() === "") {
    return {
      valid: false,
      error: "File name is required",
    };
  }

  if (
    file.name.includes("..") ||
    file.name.includes("/") ||
    file.name.includes("\\")
  ) {
    return {
      valid: false,
      error: "File name contains invalid characters",
    };
  }

  if (!isValidFileType(file.type)) {
    return {
      valid: false,
      error: `Unsupported file type: ${file.type}. Supported types: ${Object.keys(FILE_TYPE_MAP).join(", ")}`,
    };
  }

  if (!isValidFileSize(file)) {
    const category = getFileCategory(file.type)!;
    const maxSizeMB = Math.round(FILE_SIZE_LIMITS[category] / (1024 * 1024));
    return {
      valid: false,
      error: `File too large. Maximum size for ${category} files: ${maxSizeMB}MB`,
    };
  }

  return { valid: true };
}

export function getSupportedFileTypes(
  category: FileCategory,
): SupportedFileType[] {
  return Object.entries(FILE_TYPE_MAP)
    .filter(([_, cat]) => cat === category)
    .map(([mimeType]) => mimeType as SupportedFileType);
}

export function getFileTypeDescription(mimeType: string): string {
  const descriptions: Record<string, string> = {
    "image/png": "PNG Image",
    "image/jpeg": "JPEG Image",
    "image/gif": "GIF Image",
    "image/webp": "WebP Image",
    "image/svg+xml": "SVG Vector",
    "audio/mpeg": "MP3 Audio",
    "audio/wav": "WAV Audio",
    "audio/flac": "FLAC Audio",
    "audio/mp4": "M4A Audio",
    "audio/ogg": "OGG Audio",
    "video/mp4": "MP4 Video",
    "video/webm": "WebM Video",
    "video/quicktime": "QuickTime Video",
    "video/x-msvideo": "AVI Video",
    "model/gltf-binary": "GLB 3D Model",
    "model/gltf+json": "GLTF 3D Model",
    "application/octet-stream": "3D Model (OBJ/FBX/STL)",
    "application/pdf": "PDF Document",
    "text/html": "HTML Document",
    "text/plain": "Text Document",
    "application/zip": "ZIP Archive",
    "application/x-7z-compressed": "7Z Archive",
  };

  return descriptions[mimeType] || "Unknown File Type";
}
