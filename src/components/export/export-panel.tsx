"use client";

import { IPFSUpload } from "@/components/export/ipfs-upload";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { getImageFile } from "@/lib/indexeddb";
import { useProjectStore } from "@/lib/project-store";
import JSZip from "jszip";
import {
  AlertCircle,
  CheckCircle2,
  Download,
  FileJson,
  Package,
  Upload,
} from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export function ExportPanel() {
  const { projects, currentProjectId, updateProject } = useProjectStore();

  const project = projects.find((p) => p.id === currentProjectId);
  const images = project?.images || [];
  const metadataEntries = project?.metadataEntries || [];
  const exportOptions = project?.exportOptions || {
    format: "combined",
    includeImages: true,
    uploadToIPFS: false,
  };

  const setExportOptions = (updates: any) => {
    if (project) {
      updateProject(project.id, {
        exportOptions: { ...exportOptions, ...updates },
      });
    }
  };

  const validateAll = () => {
    return [];
  };

  const validationErrors: any[] = [];

  const updateMetadata = (id: string, metadata: any) => {
    if (project) {
      const updatedEntries = metadataEntries.map((entry) =>
        entry.id === id
          ? { ...entry, metadata: { ...entry.metadata, ...metadata } }
          : entry,
      );
      updateProject(project.id, { metadataEntries: updatedEntries });
    }
  };

  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [showValidationDialog, setShowValidationDialog] = useState(false);

  const generateExportFilename = useCallback(
    (extension: string) => {
      if (!project) return `nft-metadata-${Date.now()}.${extension}`;

      const sanitizedName =
        project.name
          .replace(/[^a-z0-9]/gi, "-")
          .replace(/-+/g, "-")
          .replace(/^-|-$/g, "")
          .toLowerCase()
          .slice(0, 50) || "project";

      const timestamp = Date.now().toString(36).toUpperCase();
      return `${sanitizedName}-${timestamp}.${extension}`;
    },
    [project],
  );

  const handleExport = useCallback(async () => {
    const errors = validateAll();
    if (errors.length > 0) {
      setShowValidationDialog(true);
      return;
    }

    setIsExporting(true);
    setExportProgress(0);

    try {
      const zip = new JSZip();

      if (exportOptions.format === "combined") {
        const allMetadata = metadataEntries.map((entry) => entry.metadata);
        const jsonContent = JSON.stringify(allMetadata, null, 2);
        zip.file("metadata.json", jsonContent);
        setExportProgress(30);
      } else {
        const metadataFolder = zip.folder("metadata");
        metadataEntries.forEach((entry, idx) => {
          const jsonContent = JSON.stringify(entry.metadata, null, 2);
          metadataFolder?.file(`${entry.index}.json`, jsonContent);
          setExportProgress(30 * ((idx + 1) / metadataEntries.length));
        });
      }

      if (exportOptions.includeImages) {
        const imagesFolder = zip.folder("images");
        for (let i = 0; i < images.length; i++) {
          const image = images[i];

          const imageFile = await getImageFile(image.id);
          if (imageFile) {
            imagesFolder?.file(image.name, imageFile);
          }
          setExportProgress(30 + 50 * ((i + 1) / images.length));
        }
      } else {
        setExportProgress(80);
      }

      const content = await zip.generateAsync({ type: "blob" });
      setExportProgress(100);

      const url = URL.createObjectURL(content);
      const link = document.createElement("a");
      link.href = url;
      link.download = generateExportFilename("zip");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Export successful", {
        description: `Downloaded ${metadataEntries.length} metadata file${metadataEntries.length > 1 ? "s" : ""}`,
      });
    } catch (error) {
      toast.error("Export failed", {
        description:
          error instanceof Error
            ? error.message
            : "An error occurred while exporting. Please try again.",
      });
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  }, [
    metadataEntries,
    images,
    exportOptions,
    validateAll,
    generateExportFilename,
  ]);

  const handleExportJSON = useCallback(() => {
    const errors = validateAll();
    if (errors.length > 0) {
      setShowValidationDialog(true);
      return;
    }

    const allMetadata = metadataEntries.map((entry) => entry.metadata);
    const jsonContent = JSON.stringify(allMetadata, null, 2);
    const blob = new Blob([jsonContent], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = generateExportFilename("json");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success("JSON exported", {
      description: "Metadata JSON file downloaded",
    });
  }, [metadataEntries, validateAll, generateExportFilename]);

  return (
    <>
      <Card className="w-full mx-auto">
        <CardHeader>
          <CardTitle>Export</CardTitle>
          <p className="text-sm text-muted-foreground">
            Configure and download your NFT metadata
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {validationErrors.length > 0 ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Validation Errors</AlertTitle>
              <AlertDescription>
                {validationErrors.length} error
                {validationErrors.length > 1 ? "s" : ""} found. Please fix them
                before exporting.
              </AlertDescription>
            </Alert>
          ) : (
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>Ready to Export</AlertTitle>
              <AlertDescription>
                All {metadataEntries.length} metadata entries are valid and
                ready for export.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-3">
            <Label>Export Format</Label>
            <RadioGroup
              value={exportOptions.format}
              onValueChange={(value: "combined" | "separate") =>
                setExportOptions({ format: value })
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="combined" id="combined" />
                <Label
                  htmlFor="combined"
                  className="font-normal cursor-pointer"
                >
                  Combined JSON
                  <span className="block text-xs text-muted-foreground">
                    Single file with all metadata
                  </span>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="separate" id="separate" />
                <Label
                  htmlFor="separate"
                  className="font-normal cursor-pointer"
                >
                  Separate Files
                  <span className="block text-xs text-muted-foreground">
                    Individual JSON file per NFT
                  </span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="include-images">Include Images</Label>
              <p className="text-xs text-muted-foreground">
                Bundle images with metadata in ZIP file
              </p>
            </div>
            <Switch
              id="include-images"
              checked={exportOptions.includeImages}
              onCheckedChange={(checked) =>
                setExportOptions({ includeImages: checked })
              }
            />
          </div>

          <IPFSUpload
            exportOptions={exportOptions}
            images={images}
            metadataEntries={metadataEntries}
            onUpdateMetadata={updateMetadata}
            onUpdateOptions={setExportOptions}
          />

          {isExporting && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Exporting...</span>
                <span className="font-medium">
                  {Math.round(exportProgress)}%
                </span>
              </div>
              <Progress value={exportProgress} />
            </div>
          )}

          <div className="flex gap-2 pt-4 border-t">
            <Button
              onClick={handleExportJSON}
              variant="outline"
              className="flex-1 bg-transparent"
              disabled={isExporting}
            >
              <FileJson className="h-4 w-4 mr-2" aria-hidden="true" />
              JSON Only
            </Button>
            <Button
              onClick={handleExport}
              className="flex-1"
              disabled={isExporting}
            >
              {isExporting ? (
                <>
                  <Upload
                    className="h-4 w-4 mr-2 animate-pulse"
                    aria-hidden="true"
                  />
                  Exporting...
                </>
              ) : (
                <>
                  <Package className="h-4 w-4 mr-2" aria-hidden="true" />
                  Export ZIP
                </>
              )}
            </Button>
          </div>

          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground pt-2">
            <div className="flex items-center gap-1">
              <FileJson className="h-4 w-4" aria-hidden="true" />
              <span>{metadataEntries.length} metadata</span>
            </div>
            {exportOptions.includeImages && (
              <div className="flex items-center gap-1">
                <Download className="h-4 w-4" aria-hidden="true" />
                <span>{images.length} images</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <AlertDialog
        open={showValidationDialog}
        onOpenChange={setShowValidationDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Validation Errors Found</AlertDialogTitle>
            <AlertDialogDescription>
              Please fix the following errors before exporting:
              <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
                {validationErrors.map((error, idx) => (
                  <div
                    key={idx}
                    className="text-sm p-2 border rounded-md bg-destructive/10"
                  >
                    <p className="font-medium">
                      Entry #
                      {
                        metadataEntries.find((e) => e.id === error.entryId)
                          ?.index
                      }
                    </p>
                    <p className="text-muted-foreground">
                      {error.field}: {error.message}
                    </p>
                  </div>
                ))}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowValidationDialog(false)}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
