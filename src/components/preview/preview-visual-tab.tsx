"use client";

import { Badge } from "@/components/ui/badge";
import type { ChainType } from "@/lib/types";
import { ExternalLink } from "lucide-react";
import { memo } from "react";

interface PreviewVisualTabProps {
  entry: any;
  chain: ChainType;
}

export const PreviewVisualTab = memo(
  ({ entry, chain }: PreviewVisualTabProps) => {
    return (
      <div className="space-y-4 mt-4">
        <div>
          <h3 className="font-semibold text-lg mb-1">
            {entry.metadata.name || "Untitled"}
          </h3>
          <Badge variant="secondary">#{entry.index}</Badge>
        </div>

        {entry.metadata.description && (
          <div>
            <p className="text-sm text-muted-foreground">
              {entry.metadata.description}
            </p>
          </div>
        )}

        {entry.metadata.external_url && (
          <div className="flex items-center gap-2 text-sm">
            <ExternalLink
              className="h-4 w-4 text-muted-foreground"
              aria-hidden="true"
            />
            <a
              href={entry.metadata.external_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline truncate"
            >
              {entry.metadata.external_url}
            </a>
          </div>
        )}

        {chain === "solana" && (entry.metadata as any).symbol && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Symbol:</span>
            <Badge variant="outline">{(entry.metadata as any).symbol}</Badge>
          </div>
        )}

        {chain === "xrp" && (entry.metadata as any).nftType && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">NFT Type:</span>
            <Badge variant="outline">{(entry.metadata as any).nftType}</Badge>
          </div>
        )}

        {chain === "cardano" && (entry.metadata as any).mediaType && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Media Type:</span>
            <Badge variant="outline">{(entry.metadata as any).mediaType}</Badge>
          </div>
        )}

        {chain === "near" && (entry.metadata as any).copies && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Copies:</span>
            <Badge variant="outline">{(entry.metadata as any).copies}</Badge>
          </div>
        )}

        {chain === "tezos" && (entry.metadata as any).minter && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Minter:</span>
            <Badge variant="outline" className="font-mono text-xs">
              {(entry.metadata as any).minter.slice(0, 8)}...
              {(entry.metadata as any).minter.slice(-8)}
            </Badge>
          </div>
        )}

        {chain === "flow" && (entry.metadata as any).serialNumber && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Serial #:</span>
            <Badge variant="outline">
              #{(entry.metadata as any).serialNumber}
            </Badge>
          </div>
        )}

        {(entry.metadata as any).attributes &&
          (entry.metadata as any).attributes.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold mb-2">Attributes</h4>
              <div className="grid grid-cols-2 gap-2">
                {(entry.metadata as any).attributes.map(
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
      </div>
    );
  },
);

PreviewVisualTab.displayName = "PreviewVisualTab";
