"use client";

import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink, FileJson, ImageIcon, Info } from "lucide-react";
import type { ChainType } from "@/lib/types";

interface PreviewTabsProps {
  selectedEntry: any;
  selectedImage: any;
  projectConfig: { chain: ChainType };
}

export function PreviewTabs({
  selectedEntry,
  selectedImage,
  projectConfig,
}: PreviewTabsProps) {
  return (
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

      <TabsContent value="visual" className="space-y-4 mt-4">
        <div>
          <h3 className="font-semibold text-lg mb-1">
            {selectedEntry.metadata.name || "Untitled"}
          </h3>
          <Badge variant="secondary">#{selectedEntry.index}</Badge>
        </div>

        {selectedEntry.metadata.description && (
          <div>
            <p className="text-sm text-muted-foreground">
              {selectedEntry.metadata.description}
            </p>
          </div>
        )}

        {selectedEntry.metadata.external_url && (
          <div className="flex items-center gap-2 text-sm">
            <ExternalLink
              className="h-4 w-4 text-muted-foreground"
              aria-hidden="true"
            />
            <a
              href={selectedEntry.metadata.external_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline truncate"
            >
              {selectedEntry.metadata.external_url}
            </a>
          </div>
        )}

        {projectConfig.chain === "solana" &&
          (selectedEntry.metadata as any).symbol && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Symbol:</span>
              <Badge variant="outline">
                {(selectedEntry.metadata as any).symbol}
              </Badge>
            </div>
          )}

        {(selectedEntry.metadata as any).attributes &&
          (selectedEntry.metadata as any).attributes.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold mb-2">Attributes</h4>
              <div className="grid grid-cols-2 gap-2">
                {(selectedEntry.metadata as any).attributes.map(
                  (attr: any, idx: number) => (
                    <div key={idx} className="border rounded-md p-2">
                      <p className="text-xs text-muted-foreground truncate">
                        {attr.trait_type}
                      </p>
                      <p className="text-sm font-medium truncate">
                        {attr.value}
                      </p>
                      {attr.display_type && (
                        <p className="text-xs text-muted-foreground">
                          {attr.display_type}
                        </p>
                      )}
                    </div>
                  ),
                )}
              </div>
            </div>
          )}
      </TabsContent>

      <TabsContent value="details" className="space-y-4 mt-4">
        <div className="space-y-3">
          <h4 className="text-sm font-semibold">Chain Information</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Blockchain:</span>
              <Badge variant="secondary">
                {projectConfig.chain.charAt(0).toUpperCase() +
                  projectConfig.chain.slice(1)}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Token ID:</span>
              <span className="font-mono">#{selectedEntry.index}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Image:</span>
              <span className="font-mono text-xs truncate max-w-[120px]">
                {selectedImage?.name || "Unknown"}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-semibold">Common Fields</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Name:</span>
              <span className="truncate max-w-[150px]">
                {selectedEntry.metadata.name || "Untitled"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Description:</span>
              <span className="text-xs text-muted-foreground truncate max-w-[150px]">
                {selectedEntry.metadata.description
                  ? selectedEntry.metadata.description.length > 30
                    ? selectedEntry.metadata.description.slice(0, 30) + "..."
                    : selectedEntry.metadata.description
                  : "No description"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">External URL:</span>
              <span className="text-xs text-muted-foreground truncate max-w-[150px]">
                {selectedEntry.metadata.external_url || "None"}
              </span>
            </div>
            {(selectedEntry.metadata as any).attributes && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Attributes:</span>
                <span>
                  {(selectedEntry.metadata as any).attributes.length} trait(s)
                </span>
              </div>
            )}
          </div>
        </div>
      </TabsContent>

      <TabsContent value="json" className="mt-4">
        <ScrollArea className="h-[400px] w-full rounded-md border">
          <pre className="p-4 text-xs">
            <code>{JSON.stringify(selectedEntry.metadata, null, 2)}</code>
          </pre>
        </ScrollArea>
      </TabsContent>
    </Tabs>
  );
}
