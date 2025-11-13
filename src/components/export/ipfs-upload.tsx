"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { getImageFile } from "@/lib/indexeddb";
import {
  createIPFSUploader,
  IPFS_PROVIDERS,
  validateIPFSConfig,
  type IPFSProviderType,
  type IPFSUploadProgress,
} from "@/lib/ipfs";
import { AlertCircle, CheckCircle2, Cloud } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";

interface IPFSUploadProps {
  exportOptions: any;
  images: any[];
  metadataEntries: any[];
  onUpdateMetadata: (id: string, metadata: any) => void;
  onUpdateOptions: (updates: any) => void;
}

export function IPFSUpload({
  exportOptions,
  images,
  metadataEntries,
  onUpdateMetadata,
  onUpdateOptions,
}: IPFSUploadProps) {
  const [isUploadingToIPFS, setIsUploadingToIPFS] = useState(false);
  const [ipfsProgress, setIpfsProgress] = useState<IPFSUploadProgress | null>(
    null,
  );
  const [ipfsCIDs, setIpfsCIDs] = useState<string[]>([]);

  const ipfsConfigValid = validateIPFSConfig(
    exportOptions.ipfsApiKey,
    exportOptions.ipfsProvider as IPFSProviderType,
  );
  const canUploadToIPFS = exportOptions.uploadToIPFS && ipfsConfigValid.valid;

  const handleIPFSUpload = useCallback(async () => {
    if (!exportOptions.uploadToIPFS) {
      toast.error("IPFS upload disabled", {
        description: "Please enable IPFS upload in the export options",
      });
      return;
    }

    if (!ipfsConfigValid.valid) {
      toast.error("IPFS configuration required", {
        description: ipfsConfigValid.error || "Please provide a valid API key",
      });
      return;
    }

    setIsUploadingToIPFS(true);
    setIpfsCIDs([]);

    try {
      const uploader = createIPFSUploader(
        exportOptions.ipfsApiKey,
        (exportOptions.ipfsProvider as IPFSProviderType) || "pinata",
        exportOptions.ipfsGateway,
      );

      const imageCIDs: string[] = [];
      for (let i = 0; i < images.length; i++) {
        const image = images[i];

        const imageFile = await getImageFile(image.id);
        if (!imageFile) {
          throw new Error(
            `Failed to retrieve image ${image.name} from storage`,
          );
        }

        const result = await uploader.uploadFile(imageFile, (progress) => {
          setIpfsProgress({
            ...progress,
            status: `Uploading image ${i + 1}/${images.length}: ${progress.status}`,
          });
        });

        imageCIDs.push(result.cid);
        setIpfsCIDs((prev) => [...prev, result.cid]);

        const entry = metadataEntries[i];
        if (entry) {
          const updatedMetadata = {
            ...entry.metadata,
            image: result.url,
          };
          onUpdateMetadata(entry.id, updatedMetadata);
        }
      }

      const metadataResult = await uploader.uploadJSON(
        metadataEntries.map((e) => e.metadata),
        (progress) => {
          setIpfsProgress({
            ...progress,
            status: `Uploading metadata: ${progress.status}`,
          });
        },
      );

      toast.success("IPFS upload complete", {
        description: `Uploaded ${images.length} images and metadata. CID: ${metadataResult.cid}`,
      });

      setIpfsProgress({
        current: 100,
        total: 100,
        percentage: 100,
        status: "All files uploaded to IPFS",
      });
    } catch (error) {
      toast.error("IPFS upload failed", {
        description:
          error instanceof Error
            ? error.message
            : "An error occurred during upload",
      });
    } finally {
      setIsUploadingToIPFS(false);
    }
  }, [
    images,
    metadataEntries,
    exportOptions,
    ipfsConfigValid,
    onUpdateMetadata,
  ]);

  return (
    <div className="space-y-3 p-4 border rounded-lg bg-muted/30">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="ipfs-upload">Upload to IPFS</Label>
          <p className="text-xs text-muted-foreground">
            Upload images and metadata to IPFS
          </p>
        </div>
        <Switch
          id="ipfs-upload"
          checked={exportOptions.uploadToIPFS}
          onCheckedChange={(checked) =>
            onUpdateOptions({ uploadToIPFS: checked })
          }
        />
      </div>

      {exportOptions.uploadToIPFS && (
        <div className="space-y-3 pt-3 border-t">
          <div className="space-y-2">
            <Label htmlFor="ipfs-provider">IPFS Provider</Label>
            <Select
              value={exportOptions.ipfsProvider || "pinata"}
              onValueChange={(value) =>
                onUpdateOptions({ ipfsProvider: value as IPFSProviderType })
              }
            >
              <SelectTrigger id="ipfs-provider">
                <SelectValue placeholder="Select provider" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(IPFS_PROVIDERS).map(([key, provider]) => (
                  <SelectItem key={key} value={key}>
                    {provider.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ipfs-api-key">
              API Key <span className="text-destructive">*</span>
            </Label>
            <Input
              id="ipfs-api-key"
              type="password"
              value={exportOptions.ipfsApiKey || ""}
              onChange={(e) => onUpdateOptions({ ipfsApiKey: e.target.value })}
              placeholder={`Enter your ${IPFS_PROVIDERS[(exportOptions.ipfsProvider as IPFSProviderType) || "pinata"]?.name || "IPFS"} API key`}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ipfs-gateway">IPFS Gateway (Optional)</Label>
            <Input
              id="ipfs-gateway"
              value={exportOptions.ipfsGateway || ""}
              onChange={(e) => onUpdateOptions({ ipfsGateway: e.target.value })}
              placeholder="https://ipfs.io/ipfs/"
            />
          </div>

          {!ipfsConfigValid.valid && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                {ipfsConfigValid.error}. IPFS upload requires a valid API key
                from{" "}
                {IPFS_PROVIDERS[
                  (exportOptions.ipfsProvider as IPFSProviderType) || "pinata"
                ]?.name || "IPFS"}
                .
              </AlertDescription>
            </Alert>
          )}

          {ipfsConfigValid.valid && (
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription className="text-xs">
                Ready to upload to{" "}
                {IPFS_PROVIDERS[
                  (exportOptions.ipfsProvider as IPFSProviderType) || "pinata"
                ]?.name || "IPFS"}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-3 pt-3 border-t">
            <Button
              onClick={handleIPFSUpload}
              variant="outline"
              className="w-full bg-transparent"
              disabled={!canUploadToIPFS || isUploadingToIPFS}
            >
              {isUploadingToIPFS ? (
                <>
                  <Cloud
                    className="h-4 w-4 mr-2 animate-pulse"
                    aria-hidden="true"
                  />
                  Uploading to IPFS...
                </>
              ) : (
                <>
                  <Cloud className="h-4 w-4 mr-2" aria-hidden="true" />
                  {canUploadToIPFS
                    ? "Upload to IPFS"
                    : "Configure IPFS to Upload"}
                </>
              )}
            </Button>

            {ipfsProgress && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {ipfsProgress.status}
                  </span>
                  <span className="font-medium">
                    {ipfsProgress.percentage}%
                  </span>
                </div>
                <Progress value={ipfsProgress.percentage} />
              </div>
            )}

            {ipfsCIDs.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-medium">Uploaded CIDs:</p>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {ipfsCIDs.map((cid, idx) => (
                    <div
                      key={idx}
                      className="text-xs font-mono bg-muted p-2 rounded truncate"
                    >
                      {cid}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
