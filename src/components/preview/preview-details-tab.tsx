"use client";

import { Badge } from "@/components/ui/badge";
import type { ChainType } from "@/lib/types";
import { memo } from "react";
import { ChainDetailsSections } from "./chain-details-sections";

interface PreviewDetailsTabProps {
  entry: any;
  selectedImage: any;
  chain: ChainType;
}

export const PreviewDetailsTab = memo(
  ({ entry, selectedImage, chain }: PreviewDetailsTabProps) => {
    return (
      <div className="space-y-4 mt-4">
        <div className="space-y-3">
          <h4 className="text-sm font-semibold">Chain Information</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Blockchain:</span>
              <Badge variant="secondary">
                {chain.charAt(0).toUpperCase() + chain.slice(1)}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Token ID:</span>
              <span className="font-mono">#{entry.index}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Image:</span>
              <span className="font-mono text-xs truncate max-w-[120px]">
                {selectedImage?.name || "Unknown"}
              </span>
            </div>
          </div>
        </div>

        <ChainDetailsSections entry={entry} chain={chain} />

        <div className="space-y-3">
          <h4 className="text-sm font-semibold">Common Fields</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Name:</span>
              <span className="truncate max-w-[150px]">
                {entry.metadata.name || "Untitled"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Description:</span>
              <span className="text-xs text-muted-foreground truncate max-w-[150px]">
                {entry.metadata.description
                  ? entry.metadata.description.length > 30
                    ? entry.metadata.description.slice(0, 30) + "..."
                    : entry.metadata.description
                  : "No description"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">External URL:</span>
              <span className="text-xs text-muted-foreground truncate max-w-[150px]">
                {entry.metadata.external_url || "None"}
              </span>
            </div>
            {(entry.metadata as any).attributes && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Attributes:</span>
                <span>
                  {(entry.metadata as any).attributes.length} trait(s)
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  },
);

PreviewDetailsTab.displayName = "PreviewDetailsTab";
