"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AnyMetadata, ChainType, MediaFile } from "@/lib/types";
import { memo, useMemo } from "react";

interface MetadataOptionalFieldsProps {
  metadata: AnyMetadata;
  chain: ChainType;
  onFieldChange: (field: string, value: any) => void;
  mediaFiles: MediaFile[];
  onSelectMedia: (field: string, mediaId: string) => void;
  onUploadMedia: (field: string, file: File) => Promise<void>;
  isUploading?: boolean;
}

type MediaCategory = MediaFile["category"];

const MEDIA_ACCEPT: Record<string, string> = {
  video: "video/*",
  audio: "audio/*",
  file: "application/pdf,text/plain,text/html,application/zip,application/x-7z-compressed,application/octet-stream",
};

const FIELD_CATEGORIES: Record<string, MediaCategory[]> = {
  image: ["image"],
  video: ["video"],
  audio: ["audio"],
  file: ["document", "archive"],
};

function MediaFieldRow({
  field,
  label,
  value,
  placeholder,
  mediaFiles,
  onChange,
  onSelectMedia,
  onUploadMedia,
  isUploading,
}: {
  field: string;
  label: string;
  value?: string;
  placeholder?: string;
  mediaFiles: MediaFile[];
  onChange: (value: string) => void;
  onSelectMedia: (field: string, mediaId: string) => void;
  onUploadMedia: (field: string, file: File) => Promise<void>;
  isUploading?: boolean;
}) {
  const filteredMedia = useMemo(() => {
    const allowed = FIELD_CATEGORIES[field] || [];
    if (allowed.length === 0) return mediaFiles;
    return mediaFiles.filter((file) => allowed.includes(file.category));
  }, [field, mediaFiles]);

  return (
    <div className="space-y-2">
      <Label htmlFor={field}>{label}</Label>
      <Input
        id={field}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      <div className="grid gap-2 sm:grid-cols-2">
        <Select
          onValueChange={(mediaId) => onSelectMedia(field, mediaId)}
          disabled={filteredMedia.length === 0}
        >
          <SelectTrigger>
            <SelectValue
              placeholder={
                filteredMedia.length === 0
                  ? "No uploaded files available"
                  : "Use uploaded file"
              }
            />
          </SelectTrigger>
          <SelectContent>
            {filteredMedia.map((file) => (
              <SelectItem key={file.id} value={file.id}>
                {file.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          type="file"
          accept={MEDIA_ACCEPT[field] || undefined}
          disabled={isUploading}
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (file) {
              await onUploadMedia(field, file);
              e.target.value = "";
            }
          }}
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Attach from uploads or choose a file to store and link automatically.
      </p>
    </div>
  );
}

export const MetadataOptionalFields = memo(
  ({
    metadata,
    chain,
    mediaFiles,
    onFieldChange,
    onSelectMedia,
    onUploadMedia,
    isUploading,
  }: MetadataOptionalFieldsProps) => {
    const evmChains = useMemo(
      () =>
        new Set([
          "ethereum",
          "polygon",
          "base",
          "arbitrum",
          "optimism",
          "avalanche",
          "bsc",
        ]),
      [],
    );

    return (
      <div className="space-y-4 pt-4">
        <div className="space-y-2">
          <Label htmlFor="external_url">External URL</Label>
          <Input
            id="external_url"
            value={metadata.external_url || ""}
            onChange={(e) => onFieldChange("external_url", e.target.value)}
            placeholder="https://..."
            type="url"
          />
        </div>

        {evmChains.has(chain) && (
          <>
            <div className="space-y-2">
              <Label htmlFor="background_color">Background Color</Label>
              <Input
                id="background_color"
                value={(metadata as any).background_color || ""}
                onChange={(e) =>
                  onFieldChange("background_color", e.target.value)
                }
                placeholder="FFFFFF"
                maxLength={6}
                aria-describedby="bg-color-help"
              />
              <p id="bg-color-help" className="text-xs text-muted-foreground">
                6-character hex color without #
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="animation_url">Animation URL</Label>
              <Input
                id="animation_url"
                value={(metadata as any).animation_url || ""}
                onChange={(e) => onFieldChange("animation_url", e.target.value)}
                placeholder="https://..."
                type="url"
              />
            </div>
          </>
        )}

        {chain === "xrp" && (
          <>
            <MediaFieldRow
              field="video"
              label="Video"
              value={(metadata as any).video || ""}
              placeholder="ipfs://... or uploaded file name"
              mediaFiles={mediaFiles}
              onChange={(val) => onFieldChange("video", val)}
              onSelectMedia={onSelectMedia}
              onUploadMedia={onUploadMedia}
              isUploading={isUploading}
            />
            <MediaFieldRow
              field="audio"
              label="Audio"
              value={(metadata as any).audio || ""}
              placeholder="ipfs://... or uploaded file name"
              mediaFiles={mediaFiles}
              onChange={(val) => onFieldChange("audio", val)}
              onSelectMedia={onSelectMedia}
              onUploadMedia={onUploadMedia}
              isUploading={isUploading}
            />
            <MediaFieldRow
              field="file"
              label="File"
              value={(metadata as any).file || ""}
              placeholder="ipfs://... or uploaded file name"
              mediaFiles={mediaFiles}
              onChange={(val) => onFieldChange("file", val)}
              onSelectMedia={onSelectMedia}
              onUploadMedia={onUploadMedia}
              isUploading={isUploading}
            />

            <div className="space-y-2">
              <Label htmlFor="collection.name">Collection Name</Label>
              <Input
                id="collection.name"
                value={(metadata as any).collection?.name || ""}
                onChange={(e) =>
                  onFieldChange("collection.name", e.target.value)
                }
                placeholder="Collection name"
              />
            </div>
          </>
        )}
      </div>
    );
  },
);

MetadataOptionalFields.displayName = "MetadataOptionalFields";
