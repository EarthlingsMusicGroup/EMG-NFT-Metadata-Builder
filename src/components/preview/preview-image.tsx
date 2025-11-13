"use client";

import { memo } from "react";

interface PreviewImageProps {
  previewUrl: string | null;
  alt: string;
}

export const PreviewImage = memo(({ previewUrl, alt }: PreviewImageProps) => {
  return (
    <div className="aspect-square rounded-lg overflow-hidden bg-muted border">
      <img
        src={previewUrl || "/placeholder.svg"}
        alt={alt}
        className="w-full h-full object-cover"
      />
    </div>
  );
});

PreviewImage.displayName = "PreviewImage";
