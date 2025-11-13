import type { AnyMetadata, MediaFile } from "./types";

export function enhanceMetadataWithMedia(
  metadata: AnyMetadata,
  mediaFile: MediaFile,
  baseUrl: string = "",
): AnyMetadata {
  const enhanced = { ...metadata } as any;

  if (mediaFile.category === "video" || mediaFile.category === "model") {
    enhanced.animation_url = baseUrl + mediaFile.name;
  }

  if (mediaFile.category === "audio") {
    enhanced.audio_url = baseUrl + mediaFile.name;
  }

  if (mediaFile.category === "video") {
    enhanced.video_url = baseUrl + mediaFile.name;
  }

  return enhanced;
}

export function getMediaUrlField(category: string): string {
  switch (category) {
    case "image":
      return "image";
    case "video":
    case "model":
      return "animation_url";
    case "audio":
      return "audio_url";
    default:
      return "image";
  }
}

export function supportsAnimationUrl(category: string): boolean {
  return category === "video" || category === "model";
}

export function supportsAudioUrl(category: string): boolean {
  return category === "audio";
}

export function getMediaTypeDescription(category: string): string {
  switch (category) {
    case "image":
      return "Static image";
    case "video":
      return "Video content";
    case "audio":
      return "Audio content";
    case "model":
      return "3D model";
    case "document":
      return "Document";
    case "archive":
      return "Archive";
    default:
      return "Media file";
  }
}
