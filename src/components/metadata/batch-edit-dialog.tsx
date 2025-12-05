"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { MediaFile } from "@/lib/types";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

interface BatchEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemCount: number;
  onApply: (field: string, value: string) => void;
  availableFields: string[];
  mediaFiles: MediaFile[];
  onApplyMedia: (field: string, mediaId: string) => void;
  onUploadAndApply: (field: string, file: File) => Promise<void>;
  isUploading?: boolean;
}

export function BatchEditDialog({
  open,
  onOpenChange,
  itemCount,
  onApply,
  availableFields,
  mediaFiles,
  onApplyMedia,
  onUploadAndApply,
  isUploading,
}: BatchEditDialogProps) {
  const [batchField, setBatchField] = useState<string>(
    availableFields[0] || "",
  );
  const [batchValue, setBatchValue] = useState<string>("");

  useEffect(() => {
    if (open && availableFields.length > 0 && !batchField) {
      setBatchField(availableFields[0]);
    }
  }, [availableFields, batchField, open]);

  const mediaAcceptMap: Record<string, string> = useMemo(
    () => ({
      image: "image/*",
      animation: "video/*,model/gltf-binary,model/gltf+json",
      video: "video/*",
      audio: "audio/*",
      file: "application/pdf,text/plain,text/html,application/zip,application/x-7z-compressed,application/octet-stream",
      animation_url: "video/*,model/gltf-binary,model/gltf+json",
      video_url: "video/*",
      audio_url: "audio/*",
    }),
    [],
  );

  const mediaCategories: Record<string, Array<MediaFile["category"]>> = useMemo(
    () => ({
      image: ["image"],
      animation: ["video", "model"],
      video: ["video"],
      audio: ["audio"],
      file: ["document", "archive"],
      animation_url: ["video", "model"],
      video_url: ["video"],
      audio_url: ["audio"],
    }),
    [],
  );

  const isMediaField = useMemo(
    () =>
      new Set([
        "image",
        "animation",
        "video",
        "audio",
        "file",
        "animation_url",
        "video_url",
        "audio_url",
      ]).has(batchField),
    [batchField],
  );

  const mediaOptions = useMemo(() => {
    const allowed = mediaCategories[batchField];
    if (!allowed) return [];
    return mediaFiles.filter((file) => allowed.includes(file.category));
  }, [batchField, mediaCategories, mediaFiles]);

  const handleApply = () => {
    if (!batchField || !batchValue) {
      toast.error("Missing information", {
        description: "Please select a field and enter a value",
      });
      return;
    }

    onApply(batchField, batchValue);
    onOpenChange(false);
    setBatchField("");
    setBatchValue("");

    toast.success("Batch update complete", {
      description: `Updated ${batchField} for all ${itemCount} items`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Batch Edit</DialogTitle>
          <DialogDescription>
            Apply the same value to a field across all {itemCount} items
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="batch-field">Field</Label>
            <Select
              value={batchField}
              onValueChange={(value) => {
                setBatchField(value);
                setBatchValue("");
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select field to update" />
              </SelectTrigger>
              <SelectContent>
                {availableFields.map((field) => (
                  <SelectItem key={field} value={field}>
                    {field}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="batch-value">Value</Label>
            <Input
              id="batch-value"
              value={batchValue}
              onChange={(e) => setBatchValue(e.target.value)}
              placeholder="Enter value to apply"
            />
          </div>

          {isMediaField && (
            <div className="space-y-2">
              <Label>Use uploaded media</Label>
              <Select
                onValueChange={(mediaId) => onApplyMedia(batchField, mediaId)}
                disabled={mediaOptions.length === 0}
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={
                      mediaOptions.length === 0
                        ? "No media available"
                        : "Select uploaded file"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {mediaOptions.map((file) => (
                    <SelectItem key={file.id} value={file.id}>
                      {file.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="space-y-1">
                <Label htmlFor="batch-upload">Upload and apply</Label>
                <Input
                  id="batch-upload"
                  type="file"
                  accept={mediaAcceptMap[batchField] || undefined}
                  disabled={isUploading}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      await onUploadAndApply(batchField, file);
                      e.target.value = "";
                    }
                  }}
                />
                <p className="text-xs text-muted-foreground">
                  Upload once and apply this file to all items.
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleApply}>Apply to All</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
