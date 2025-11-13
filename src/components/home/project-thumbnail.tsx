"use client";

import { useEffect, useState } from "react";
import { getImageBlob } from "@/lib/indexeddb";

export function ProjectThumbnail({ imageId }: { imageId?: string }) {
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (imageId) {
      setIsLoading(true);
      getImageBlob(imageId)
        .then((url) => {
          setThumbnailUrl(url);
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [imageId]);

  const showPlaceholder = !imageId || isLoading || !thumbnailUrl;

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden bg-muted">
      {showPlaceholder ? (
        <img
          src="/placeholder.svg"
          alt=""
          className="w-full h-full object-cover"
          role="presentation"
        />
      ) : (
        <img
          src={thumbnailUrl!}
          alt="Project thumbnail"
          className="w-full h-full object-cover"
          onError={() => {
            setThumbnailUrl(null);
            setIsLoading(false);
          }}
        />
      )}
    </div>
  );
}
