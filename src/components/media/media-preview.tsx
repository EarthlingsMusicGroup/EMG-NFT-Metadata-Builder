"use client";

import { Card, CardContent } from "@/components/ui/card";
import { getMediaBlob, getMediaFile } from "@/lib/indexeddb";
import {
  Archive,
  Box,
  Download,
  FileAudio,
  FileImage,
  FileText,
  FileVideo,
} from "lucide-react";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getFileTypeDescription } from "@/lib/file-validation";
import type { MediaFile } from "@/lib/types";
import { toast } from "sonner";

interface MediaPreviewProps {
  mediaFile: MediaFile;
  className?: string;
  showControls?: boolean;
  autoPlay?: boolean;
}

export function MediaPreview({
  mediaFile,
  className = "",
  showControls = true,
  autoPlay = false,
}: MediaPreviewProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    loadPreview();

    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [mediaFile.id]);

  const loadPreview = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const url = await getMediaBlob(mediaFile.id);
      if (url) {
        setPreviewUrl(url);
      } else {
        setError("Failed to load preview");
      }
    } catch (err) {
      setError("Failed to load preview");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const file = await getMediaFile(mediaFile.id);
      if (file) {
        const url = URL.createObjectURL(file);
        const link = document.createElement("a");
        link.href = url;
        link.download = mediaFile.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      toast.error("Failed to download file");
    }
  };

  const getCategoryIcon = (category: string) => {
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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (isLoading) {
    return (
      <Card className={`w-full ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">
                Loading preview...
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={`w-full ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <div className="text-destructive mb-2">
                {getCategoryIcon(mediaFile.category)}
              </div>
              <p className="text-sm text-destructive">{error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={loadPreview}
                className="mt-2"
              >
                Retry
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`w-full ${className}`}>
      <CardContent className="p-0">
        <div className="relative">
          {mediaFile.category === "image" && previewUrl && (
            <img
              src={previewUrl}
              alt={mediaFile.name}
              className="w-full h-48 object-cover rounded-t-lg"
            />
          )}

          {mediaFile.category === "video" && previewUrl && (
            <video
              src={previewUrl}
              className="w-full h-48 object-cover rounded-t-lg"
              controls={showControls}
              autoPlay={autoPlay}
              muted={isMuted}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
          )}

          {mediaFile.category === "audio" && previewUrl && (
            <div className="w-full h-32 bg-muted flex items-center justify-center rounded-t-lg">
              <audio
                src={previewUrl}
                controls={showControls}
                autoPlay={autoPlay}
                muted={isMuted}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                className="w-full"
              />
            </div>
          )}

          {(mediaFile.category === "model" ||
            mediaFile.category === "document" ||
            mediaFile.category === "archive") && (
            <div className="w-full h-48 bg-muted flex items-center justify-center rounded-t-lg">
              <div className="text-center">
                <div className="text-4xl mb-2">
                  {getCategoryIcon(mediaFile.category)}
                </div>
                <p className="text-sm text-muted-foreground">
                  {getFileTypeDescription(mediaFile.type)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatFileSize(mediaFile.size)}
                </p>
              </div>
            </div>
          )}

          {showControls && previewUrl && (
            <div className="absolute top-2 right-2 flex gap-1">
              <Button
                size="sm"
                variant="secondary"
                onClick={handleDownload}
                className="h-8 w-8 p-0"
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        <div className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getCategoryIcon(mediaFile.category)}
              <span className="font-medium text-sm truncate">
                {mediaFile.name}
              </span>
            </div>
            <Badge variant="secondary" className="text-xs">
              {mediaFile.category}
            </Badge>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{getFileTypeDescription(mediaFile.type)}</span>
            <span>{formatFileSize(mediaFile.size)}</span>
          </div>

          {showControls && (
            <div className="flex gap-2 pt-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleDownload}
                className="flex-1"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
