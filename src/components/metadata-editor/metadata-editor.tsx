"use client";

import { useMetadataEditor } from "@/components/metadata-editor/metadata-editor-hooks";
import { MetadataFormFields } from "@/components/metadata-editor/metadata-form-fields";
import { MetadataList } from "@/components/metadata-editor/metadata-list";
import { MetadataOptionalFields } from "@/components/metadata-editor/metadata-optional-fields";
import { AttributeEditor } from "@/components/metadata/attribute-editor";
import { BatchEditDialog } from "@/components/metadata/batch-edit-dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getFileCategory, validateFile } from "@/lib/file-validation";
import { storeMediaFile } from "@/lib/indexeddb";
import { useProjectStore } from "@/lib/project-store";
import { getSchemaForChain } from "@/lib/schemas";
import type { MediaFile } from "@/lib/types";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

interface MetadataEditorProps {
  selectedIndex?: number;
  onSelectIndex?: (index: number) => void;
}

export function MetadataEditor({
  selectedIndex: externalSelectedIndex = 0,
  onSelectIndex,
}: MetadataEditorProps = {}) {
  const { projects, currentProjectId, updateProject } = useProjectStore();

  const project = projects.find((p) => p.id === currentProjectId);
  const projectConfig = project?.projectConfig || {
    chain: "ethereum" as any,
    collectionName: "",
    collectionDescription: "",
    externalUrl: "",
    creatorAddress: "",
    royaltyPercentage: 5,
    symbol: "NFT",
    storageType: "local",
  };
  const images = project?.images || [];
  const metadataEntries = project?.metadataEntries || [];

  const updateMetadata = useCallback(
    (index: number, updates: any) => {
      if (project) {
        const updatedEntries = [...metadataEntries];
        updatedEntries[index] = {
          ...updatedEntries[index],
          metadata: { ...updatedEntries[index].metadata, ...updates },
        };
        updateProject(project.id, { metadataEntries: updatedEntries });
      }
    },
    [project, metadataEntries, updateProject],
  );

  const applyFieldUpdate = useCallback(
    (metadata: any, field: string, value: any) => {
      if (field.startsWith("collection.")) {
        const [, key] = field.split(".");
        return {
          ...metadata,
          collection: {
            ...(metadata.collection || {}),
            [key]: value,
          },
        };
      }

      return { ...metadata, [field]: value };
    },
    [],
  );

  const batchUpdateMetadata = useCallback(
    (field: string, value: string) => {
      if (project) {
        const updatedEntries = metadataEntries.map((entry) => ({
          ...entry,
          metadata: applyFieldUpdate(entry.metadata, field, value),
        }));
        updateProject(project.id, { metadataEntries: updatedEntries });
      }
    },
    [applyFieldUpdate, project, metadataEntries, updateProject],
  );

  const regenerateMetadata = useCallback(() => {
    if (project) {
      const updatedEntries = images.map((img, index) => ({
        id: `metadata-${img.id}`,
        imageId: img.id,
        index: index + 1,
        metadata: {
          name: `${projectConfig.collectionName} #${index + 1}`,
          description: `${projectConfig.collectionDescription} - Item ${index + 1}`,
          image: img.name || `${index + 1}.png`,
          external_url: projectConfig.externalUrl || "",
          background_color: "FFFFFF",
          attributes: [],
        },
      }));
      updateProject(project.id, { metadataEntries: updatedEntries });
    }
  }, [project, images, projectConfig, updateProject]);

  const [internalSelectedIndex, setInternalSelectedIndex] = useState(0);
  const currentSelectedIndex = onSelectIndex
    ? externalSelectedIndex
    : internalSelectedIndex;
  const setCurrentSelectedIndex = onSelectIndex || setInternalSelectedIndex;
  const [showBatchDialog, setShowBatchDialog] = useState(false);

  const schema = useMemo(
    () => getSchemaForChain(projectConfig.chain),
    [projectConfig.chain],
  );

  const currentEntry = useMemo(
    () => metadataEntries[currentSelectedIndex],
    [metadataEntries, currentSelectedIndex],
  );
  const currentImage = useMemo(
    () => images.find((img) => img.id === currentEntry?.imageId),
    [images, currentEntry],
  );

  const applyValueToCurrent = useCallback(
    (field: string, value: string) => {
      if (!currentEntry) return;
      const updated = applyFieldUpdate(currentEntry.metadata, field, value);
      updateMetadata(currentSelectedIndex, updated);
    },
    [applyFieldUpdate, currentEntry, currentSelectedIndex, updateMetadata],
  );

  const handleSelectMediaForCurrent = useCallback(
    (field: string, mediaId: string) => {
      const media = images.find((m) => m.id === mediaId);
      if (!media) {
        toast.error("File not found");
        return;
      }
      applyValueToCurrent(field, media.name);
      toast.success(`Attached ${media.name} to current item`);
    },
    [applyValueToCurrent, images],
  );

  const handleBatchSelectMedia = useCallback(
    (field: string, mediaId: string) => {
      const media = images.find((m) => m.id === mediaId);
      if (!media) {
        toast.error("File not found");
        return;
      }
      batchUpdateMetadata(field, media.name);
      toast.success(`Applied ${media.name} to all items`);
    },
    [batchUpdateMetadata, images],
  );

  const [isInlineUploading, setIsInlineUploading] = useState(false);

  const handleMediaUpload = useCallback(
    async (field: string, file: File, applyToAll: boolean = false) => {
      if (!project) return;

      const validation = validateFile(file);
      if (!validation.valid) {
        toast.error("Upload failed", { description: validation.error });
        return;
      }

      const category = getFileCategory(file.type);
      if (!category) {
        toast.error("Unsupported file type");
        return;
      }

      setIsInlineUploading(true);
      try {
        const id = `media-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        await storeMediaFile(id, file, category);

        const mediaFile: MediaFile = {
          id,
          name: file.name,
          index: images.length + 1,
          size: file.size,
          type: file.type as MediaFile["type"],
          category,
          lastModified: file.lastModified,
        };

        const updatedImages = [...images, mediaFile];
        const value = file.name;

        if (applyToAll) {
          const updatedEntries = metadataEntries.map((entry) => ({
            ...entry,
            metadata: applyFieldUpdate(entry.metadata, field, value),
          }));
          updateProject(project.id, {
            images: updatedImages,
            metadataEntries: updatedEntries,
          });
          toast.success(`Uploaded and applied ${value} to all items`);
        } else if (currentEntry) {
          const updatedEntries = [...metadataEntries];
          const updatedMetadata = applyFieldUpdate(
            currentEntry.metadata,
            field,
            value,
          );
          updatedEntries[currentSelectedIndex] = {
            ...currentEntry,
            metadata: updatedMetadata,
          };
          updateProject(project.id, {
            images: updatedImages,
            metadataEntries: updatedEntries,
          });
          toast.success(`Uploaded and attached ${value}`);
        } else {
          updateProject(project.id, { images: updatedImages });
        }
      } catch (error) {
        toast.error("Upload failed", {
          description: "Could not process the selected file.",
        });
      } finally {
        setIsInlineUploading(false);
      }
    },
    [
      applyFieldUpdate,
      currentEntry,
      currentSelectedIndex,
      images,
      metadataEntries,
      project,
      updateProject,
    ],
  );
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      if (e.key === "ArrowUp" && currentSelectedIndex > 0) {
        e.preventDefault();
        setCurrentSelectedIndex(currentSelectedIndex - 1);
      } else if (
        e.key === "ArrowDown" &&
        currentSelectedIndex < metadataEntries.length - 1
      ) {
        e.preventDefault();
        setCurrentSelectedIndex(currentSelectedIndex + 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentSelectedIndex, metadataEntries.length, setCurrentSelectedIndex]);

  const {
    handleFieldChange,
    handleAddAttribute,
    handleUpdateAttribute,
    handleRemoveAttribute,
    handleRegenerateAll,
  } = useMetadataEditor({
    currentEntry,
    currentSelectedIndex,
    projectConfig,
    updateMetadata,
    batchUpdateMetadata,
    regenerateMetadata,
  });

  const handleBatchUpdate = useCallback(
    (field: string, value: string) => {
      batchUpdateMetadata(field, value);
      setShowBatchDialog(false);
    },
    [batchUpdateMetadata],
  );

  const availableBatchFields = useMemo(() => {
    const base = ["name", "description", "image", "external_url"];
    if (projectConfig.chain === "xrp") {
      return [
        ...base,
        "schema",
        "nftType",
        "video",
        "audio",
        "file",
        "collection.name",
      ];
    }

    if (
      projectConfig.chain === "ethereum" ||
      projectConfig.chain === "polygon" ||
      projectConfig.chain === "base" ||
      projectConfig.chain === "arbitrum" ||
      projectConfig.chain === "optimism" ||
      projectConfig.chain === "avalanche" ||
      projectConfig.chain === "bsc"
    ) {
      return [
        ...base,
        "background_color",
        "animation_url",
        "youtube_url",
        "video_url",
        "audio_url",
      ];
    }

    return base;
  }, [projectConfig.chain]);

  if (!currentEntry || !currentImage) {
    return (
      <Card>
        <CardContent className="py-12">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No images uploaded yet. Please upload images first.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Edit Metadata</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Customize metadata for {metadataEntries.length} item
              {metadataEntries.length > 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowBatchDialog(true)}
            >
              Batch Edit
            </Button>
            <Button variant="outline" size="sm" onClick={handleRegenerateAll}>
              <RefreshCw className="h-4 w-4 mr-2" aria-hidden="true" />
              Reset All
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid lg:grid-cols-[320px_1fr] gap-6">
          <MetadataList
            metadataEntries={metadataEntries}
            images={images}
            selectedIndex={currentSelectedIndex}
            onSelect={setCurrentSelectedIndex}
          />

          <div className="space-y-6" role="region" aria-label="Metadata editor">
            <MetadataFormFields
              metadata={currentEntry.metadata}
              chain={projectConfig.chain}
              index={currentEntry.index}
              onFieldChange={handleFieldChange}
            />

            <Accordion type="single" collapsible>
              <AccordionItem value="optional">
                <AccordionTrigger>Optional Fields</AccordionTrigger>
                <AccordionContent>
                  <MetadataOptionalFields
                    metadata={currentEntry.metadata}
                    chain={projectConfig.chain}
                    mediaFiles={images}
                    onFieldChange={handleFieldChange}
                    onSelectMedia={handleSelectMediaForCurrent}
                    onUploadMedia={(field, file) =>
                      handleMediaUpload(field, file, false)
                    }
                    isUploading={isInlineUploading}
                  />
                </AccordionContent>
              </AccordionItem>

              {schema.supportsAttributes && (
                <AccordionItem value="attributes">
                  <AccordionTrigger>
                    Attributes
                    {(currentEntry.metadata as any).attributes &&
                      (currentEntry.metadata as any).attributes.length > 0 && (
                        <Badge variant="secondary" className="ml-2">
                          {(currentEntry.metadata as any).attributes.length}
                        </Badge>
                      )}
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    <AttributeEditor
                      attributes={
                        (currentEntry.metadata as any).attributes || []
                      }
                      chain={projectConfig.chain}
                      onAdd={handleAddAttribute}
                      onUpdate={handleUpdateAttribute}
                      onRemove={handleRemoveAttribute}
                    />
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>

            <div className="flex justify-between pt-4 border-t">
              <Button
                variant="outline"
                onClick={() =>
                  setCurrentSelectedIndex(Math.max(0, currentSelectedIndex - 1))
                }
                disabled={currentSelectedIndex === 0}
                aria-label="Previous item"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  setCurrentSelectedIndex(
                    Math.min(
                      metadataEntries.length - 1,
                      currentSelectedIndex + 1,
                    ),
                  )
                }
                disabled={currentSelectedIndex === metadataEntries.length - 1}
                aria-label="Next item"
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </CardContent>

      <BatchEditDialog
        open={showBatchDialog}
        onOpenChange={setShowBatchDialog}
        itemCount={metadataEntries.length}
        onApply={handleBatchUpdate}
        availableFields={availableBatchFields}
        mediaFiles={images}
        onApplyMedia={handleBatchSelectMedia}
        onUploadAndApply={(field, file) => handleMediaUpload(field, file, true)}
        isUploading={isInlineUploading}
      />
    </Card>
  );
}
