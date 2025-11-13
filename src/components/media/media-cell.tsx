"use client";

import { Button } from "@/components/ui/button";
import { getMediaBlob } from "@/lib/indexeddb";
import type { FileCategory, MediaFile } from "@/lib/types";
import {
  Archive,
  Box,
  FileAudio,
  FileImage,
  FileText,
  FileVideo,
  X,
} from "lucide-react";
import { memo, useEffect, useState } from "react";

interface MediaCellProps {
  columnIndex: number;
  rowIndex: number;
  style: React.CSSProperties;
  mediaFile: MediaFile;
  columnCount: number;
  onRemove: (id: string) => void;
}

export const MediaCell = memo(
  ({ style, mediaFile, onRemove }: MediaCellProps) => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
      if (mediaFile.id) {
        getMediaBlob(mediaFile.id).then((url) => setPreviewUrl(url));
      }
    }, [mediaFile.id]);

    const getCategoryIcon = (category: FileCategory) => {
      switch (category) {
        case "image":
          return <FileImage className="h-4 w-4" />;
        case "audio":
          return <FileAudio className="h-4 w-4" />;
        case "video":
          return <FileVideo className="h-4 w-4" />;
        case "model":
          return <Box className="h-4 w-4" />;
        case "document":
          return <FileText className="h-4 w-4" />;
        case "archive":
          return <Archive className="h-4 w-4" />;
        default:
          return <FileImage className="h-4 w-4" />;
      }
    };

    const renderPreview = () => {
      if (!previewUrl) {
        return (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <div className="text-center">
              {getCategoryIcon(mediaFile.category)}
              <p className="text-xs mt-1 text-muted-foreground">
                {mediaFile.category}
              </p>
            </div>
          </div>
        );
      }

      switch (mediaFile.category) {
        case "image":
          return (
            <img
              src={previewUrl}
              alt={mediaFile.name}
              className="w-full h-full object-cover"
            />
          );
        case "video":
          return (
            <video
              src={previewUrl}
              className="w-full h-full object-cover"
              muted
              preload="metadata"
            />
          );
        case "audio":
          return (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <FileAudio className="h-8 w-8 text-muted-foreground" />
            </div>
          );
        default:
          return (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              {getCategoryIcon(mediaFile.category)}
            </div>
          );
      }
    };

    return (
      <div style={style} className="p-2">
        <div className="group relative aspect-square rounded-lg overflow-hidden border border-border bg-muted">
          {renderPreview()}

          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button
              variant="destructive"
              size="icon"
              className="h-8 w-8"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(mediaFile.id);
              }}
              aria-label={`Remove ${mediaFile.name}`}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="absolute top-2 left-2">
            <div className="flex items-center gap-1 bg-black/70 text-white text-xs px-2 py-1 rounded">
              {getCategoryIcon(mediaFile.category)}
              <span className="capitalize">{mediaFile.category}</span>
            </div>
          </div>

          <div className="absolute top-2 right-2 bg-background/90 text-foreground text-xs font-medium px-2 py-1 rounded">
            #{mediaFile.index}
          </div>
        </div>
      </div>
    );
  },
);

MediaCell.displayName = "MediaCell";
