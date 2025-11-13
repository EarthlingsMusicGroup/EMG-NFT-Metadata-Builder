"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useMemo, useState } from "react";

import { PreviewDetailsTab } from "@/components/preview/preview-details-tab";
import { PreviewImage } from "@/components/preview/preview-image";
import { PreviewJsonTab } from "@/components/preview/preview-json-tab";
import { PreviewVisualTab } from "@/components/preview/preview-visual-tab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getImageBlob } from "@/lib/indexeddb";
import { useProjectStore } from "@/lib/project-store";
import { FileJson, ImageIcon, Info } from "lucide-react";

interface PreviewPanelProps {
  selectedIndex?: number;
}

export function PreviewPanel({ selectedIndex = 0 }: PreviewPanelProps) {
  const { projects, currentProjectId } = useProjectStore();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const project = projects.find((p) => p.id === currentProjectId);
  const images = project?.images || [];
  const metadataEntries = project?.metadataEntries || [];
  const projectConfig = project?.projectConfig || { chain: "ethereum" as any };
  const selectedEntry = useMemo(() => {
    return metadataEntries[selectedIndex] || metadataEntries[0];
  }, [metadataEntries, selectedIndex]);

  const selectedImage = useMemo(() => {
    if (!selectedEntry) return null;
    return images.find((img) => img.id === selectedEntry.imageId);
  }, [images, selectedEntry]);

  useEffect(() => {
    if (selectedImage?.id) {
      getImageBlob(selectedImage.id).then((url) => setPreviewUrl(url));
    } else {
      setPreviewUrl(null);
    }
  }, [selectedImage?.id]);

  if (!selectedEntry || !selectedImage) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          <p>No metadata to preview</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-fit sticky top-4">
      <CardHeader>
        <CardTitle className="text-lg">Preview</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <PreviewImage
          previewUrl={previewUrl}
          alt={selectedEntry.metadata.name || `#${selectedEntry.index}`}
        />

        <Tabs defaultValue="visual" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="visual" className="flex-1">
              <ImageIcon className="h-4 w-4 mr-2" aria-hidden="true" />
              Visual
            </TabsTrigger>
            <TabsTrigger value="details" className="flex-1">
              <Info className="h-4 w-4 mr-2" aria-hidden="true" />
              Details
            </TabsTrigger>
            <TabsTrigger value="json" className="flex-1">
              <FileJson className="h-4 w-4 mr-2" aria-hidden="true" />
              JSON
            </TabsTrigger>
          </TabsList>

          <TabsContent value="visual">
            <PreviewVisualTab
              entry={selectedEntry}
              chain={projectConfig.chain}
            />
          </TabsContent>

          <TabsContent value="details">
            <PreviewDetailsTab
              entry={selectedEntry}
              selectedImage={selectedImage}
              chain={projectConfig.chain}
            />
          </TabsContent>

          <TabsContent value="json">
            <PreviewJsonTab metadata={selectedEntry.metadata} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
