"use client";

import { getFileCategory, validateFile } from "@/lib/file-validation";
import { deleteMediaFile, storeMediaFile } from "@/lib/indexeddb";
import type { MediaFile } from "@/lib/types";
import { Upload } from "lucide-react";
import { useCallback, useState } from "react";

import { MediaCell } from "@/components/media/media-cell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useProjectStore } from "@/lib/project-store";
import { memo } from "react";
import type { CellComponentProps } from "react-window";
import { Grid } from "react-window";
import { toast } from "sonner";

type CellProps = {
  mediaFiles: MediaFile[];
  columnCount: number;
  onRemove: (id: string) => void;
};

const CellComponent = memo(
  ({
    columnIndex,
    rowIndex,
    style,
    mediaFiles,
    columnCount,
    onRemove,
  }: CellComponentProps<CellProps>) => {
    const index = rowIndex * columnCount + columnIndex;
    if (index >= mediaFiles.length) {
      return <div style={style} />;
    }
    const mediaFile = mediaFiles[index];
    return (
      <MediaCell
        columnIndex={columnIndex}
        rowIndex={rowIndex}
        style={style}
        mediaFile={mediaFile}
        columnCount={columnCount}
        onRemove={onRemove}
      />
    );
  },
);

CellComponent.displayName = "CellComponent";

export function MediaUploader() {
  const { projects, currentProjectId, updateProject } = useProjectStore();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const project = projects.find((p) => p.id === currentProjectId);
  const mediaFiles = project?.images || [];

  const addMedia = useCallback(
    async (files: File[]) => {
      if (!project) return;

      const processedMedia: MediaFile[] = [];
      const errors: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        try {
          const validation = validateFile(file);
          if (!validation.valid) {
            errors.push(`${file.name}: ${validation.error}`);
            continue;
          }

          const category = getFileCategory(file.type)!;
          const id = `media-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

          await storeMediaFile(id, file, category);

          const mediaFile: MediaFile = {
            id,
            name: file.name,
            index: mediaFiles.length + processedMedia.length + 1,
            size: file.size,
            type: file.type as any,
            category,
            lastModified: file.lastModified,
          };

          processedMedia.push(mediaFile);
        } catch (error) {
          errors.push(`${file.name}: Failed to store file`);
        }
      }

      if (processedMedia.length > 0) {
        updateProject(project.id, {
          images: [...mediaFiles, ...processedMedia],
        });
        toast.success(
          `Added ${processedMedia.length} file${processedMedia.length > 1 ? "s" : ""}`,
        );
      }

      if (errors.length > 0) {
        toast.error("Some files were skipped", {
          description: errors.join("\n"),
        });
      }
    },
    [project, mediaFiles, updateProject],
  );

  const removeMedia = useCallback(
    async (id: string) => {
      if (!project) return;

      try {
        await deleteMediaFile(id);

        const updatedFiles = mediaFiles.filter((file) => file.id !== id);
        updateProject(project.id, { images: updatedFiles });

        toast.success("File removed");
      } catch (error) {
        toast.error("Failed to remove file");
      }
    },
    [project, mediaFiles, updateProject],
  );

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;

      const fileArray = Array.from(files);
      setIsUploading(true);

      try {
        await addMedia(fileArray);
      } catch (error) {
        toast.error("Upload failed", {
          description: "Failed to process files. Please try again.",
        });
      } finally {
        setIsUploading(false);
      }
    },
    [addMedia],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles],
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFiles(e.target.files);
      e.target.value = "";
    },
    [handleFiles],
  );

  const handleRemove = useCallback(
    (id: string) => {
      removeMedia(id);
    },
    [removeMedia],
  );

  const columnCount = 6;
  const rowCount = Math.ceil(mediaFiles.length / columnCount);

  if (!project) {
    return (
      <Card className="w-full">
        <div className="p-8 text-center">
          <p className="text-muted-foreground">No project selected</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="max-w-5xl mx-auto p-6">
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold mb-1">Upload Media Files</h2>
          <p className="text-sm text-muted-foreground">
            Add your NFT media files. Supports: Images, Audio, Video, 3D Models,
            Documents, Archives
          </p>
        </div>

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative border-2 border-dashed rounded-lg p-12 transition-colors
            ${isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}
            ${isUploading ? "opacity-50 pointer-events-none" : ""}
          `}
        >
          <input
            type="file"
            id="media-upload"
            multiple
            accept="image/*,audio/*,video/*,model/gltf-binary,model/gltf+json,application/pdf,text/html,text/plain,application/zip,application/x-7z-compressed"
            onChange={handleFileInput}
            disabled={isUploading}
            className="sr-only"
          />

          <label
            htmlFor="media-upload"
            className="flex flex-col items-center justify-center gap-4 cursor-pointer"
          >
            <div className="rounded-full bg-primary/10 p-4">
              <Upload className="h-8 w-8 text-primary" aria-hidden="true" />
            </div>
            <div className="text-center">
              <p className="text-lg font-medium">
                {isDragging ? "Drop files here" : "Drag and drop files here"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                or{" "}
                <span className="text-primary font-medium">browse files</span>
              </p>
            </div>
          </label>
        </div>

        {mediaFiles.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium">
                {mediaFiles.length} file{mediaFiles.length > 1 ? "s" : ""}{" "}
                uploaded
              </p>
              <div className="text-sm text-muted-foreground">
                {mediaFiles.filter((f) => f.category === "image").length}{" "}
                images,{" "}
                {mediaFiles.filter((f) => f.category === "audio").length} audio,{" "}
                {mediaFiles.filter((f) => f.category === "video").length} video,{" "}
                {mediaFiles.filter((f) => f.category === "model").length}{" "}
                models,{" "}
                {mediaFiles.filter((f) => f.category === "document").length}{" "}
                documents,{" "}
                {mediaFiles.filter((f) => f.category === "archive").length}{" "}
                archives
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const input = document.getElementById(
                    "media-upload",
                  ) as HTMLInputElement;
                  input?.click();
                }}
              >
                <Upload className="h-4 w-4 mr-2" aria-hidden="true" />
                Add More
              </Button>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <Grid<CellProps>
                cellComponent={CellComponent}
                cellProps={{
                  mediaFiles,
                  columnCount,
                  onRemove: handleRemove,
                }}
                columnCount={columnCount}
                columnWidth={120}
                rowCount={rowCount}
                rowHeight={120}
                style={{
                  height: Math.min(600, rowCount * 120),
                  width: columnCount * 120,
                }}
              />
            </div>
          </div>
        )}

        {isUploading && (
          <div className="mt-4 text-center">
            <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              Uploading files...
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
