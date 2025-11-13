"use client";

import { Badge } from "@/components/ui/badge";
import { getImageBlob } from "@/lib/indexeddb";
import { ChevronRight } from "lucide-react";
import { memo, useEffect, useState } from "react";

interface MetadataRowProps {
  index: number;
  style: React.CSSProperties;
  entry: any;
  image: any;
  isSelected: boolean;
  onSelect: (index: number) => void;
}

export const MetadataRow = memo(
  ({ index, style, entry, image, isSelected, onSelect }: MetadataRowProps) => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
      if (image?.id) {
        getImageBlob(image.id).then((url) => setPreviewUrl(url));
      }
    }, [image?.id]);

    return (
      <div style={style}>
        <button
          onClick={() => onSelect(index)}
          className={`
          w-full flex items-center gap-3 p-3 border-b transition-colors text-left
          ${isSelected ? "bg-primary/10 border-primary" : "hover:bg-muted/50"}
        `}
          aria-label={`Edit metadata for item ${entry.index}`}
          aria-current={isSelected ? "true" : undefined}
        >
          <div className="size-12 rounded overflow-hidden bg-muted flex-shrink-0 border">
            {image && (
              <img
                src={previewUrl || "/placeholder.svg"}
                alt=""
                className="w-full h-full object-cover"
                role="presentation"
              />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="secondary" className="text-xs">
                #{entry.index}
              </Badge>
              <span className="font-medium truncate">
                {entry.metadata.name || "Untitled"}
              </span>
            </div>
            {entry.metadata.description && (
              <p className="text-xs text-muted-foreground truncate">
                {entry.metadata.description}
              </p>
            )}
          </div>
          {isSelected && (
            <ChevronRight
              className="h-5 w-5 text-primary flex-shrink-0"
              aria-hidden="true"
            />
          )}
        </button>
      </div>
    );
  },
);

MetadataRow.displayName = "MetadataRow";
