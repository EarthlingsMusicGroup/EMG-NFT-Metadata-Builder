"use client";

import type { ChainType } from "@/lib/types";
import { memo } from "react";

interface ChainDetailsSectionsProps {
  entry: any;
  chain: ChainType;
}

export const ChainDetailsSections = memo(
  ({ entry, chain }: ChainDetailsSectionsProps) => {
    switch (chain) {
      case "solana":
        return (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Solana Details</h4>
            <div className="space-y-2 text-sm">
              {(entry.metadata as any).symbol && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Symbol:</span>
                  <span className="font-mono">
                    {(entry.metadata as any).symbol}
                  </span>
                </div>
              )}
              {(entry.metadata as any).seller_fee_basis_points && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Royalty:</span>
                  <span>
                    {(
                      (entry.metadata as any).seller_fee_basis_points / 100
                    ).toFixed(2)}
                    %
                  </span>
                </div>
              )}
            </div>
          </div>
        );

      case "xrp":
        return (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">XRPL Details</h4>
            <div className="space-y-2 text-sm">
              {(entry.metadata as any).nftType && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">NFT Type:</span>
                  <span>{(entry.metadata as any).nftType}</span>
                </div>
              )}
              {(entry.metadata as any).issuer && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Issuer:</span>
                  <span className="font-mono text-xs">
                    {(entry.metadata as any).issuer.slice(0, 8)}...
                    {(entry.metadata as any).issuer.slice(-8)}
                  </span>
                </div>
              )}
              {(entry.metadata as any).schema && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Schema:</span>
                  <span className="font-mono text-xs truncate max-w-[120px]">
                    {(entry.metadata as any).schema}
                  </span>
                </div>
              )}
            </div>
          </div>
        );

      case "cardano":
        return (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Cardano Details</h4>
            <div className="space-y-2 text-sm">
              {(entry.metadata as any).mediaType && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Media Type:</span>
                  <span>{(entry.metadata as any).mediaType}</span>
                </div>
              )}
              {(entry.metadata as any).mint?.policy_id && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Policy ID:</span>
                  <span className="font-mono text-xs">
                    {(entry.metadata as any).mint.policy_id.slice(0, 8)}...
                    {(entry.metadata as any).mint.policy_id.slice(-8)}
                  </span>
                </div>
              )}
            </div>
          </div>
        );

      case "tezos":
        return (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Tezos Details</h4>
            <div className="space-y-2 text-sm">
              {(entry.metadata as any).minter && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Minter:</span>
                  <span className="font-mono text-xs">
                    {(entry.metadata as any).minter.slice(0, 8)}...
                    {(entry.metadata as any).minter.slice(-8)}
                  </span>
                </div>
              )}
              {(entry.metadata as any).artifactUri && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Artifact URI:</span>
                  <span className="font-mono text-xs truncate max-w-[120px]">
                    {(entry.metadata as any).artifactUri}
                  </span>
                </div>
              )}
              {(entry.metadata as any).displayUri && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Display URI:</span>
                  <span className="font-mono text-xs truncate max-w-[120px]">
                    {(entry.metadata as any).displayUri}
                  </span>
                </div>
              )}
            </div>
          </div>
        );

      case "near":
        return (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">NEAR Details</h4>
            <div className="space-y-2 text-sm">
              {(entry.metadata as any).copies && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Copies:</span>
                  <span>{(entry.metadata as any).copies}</span>
                </div>
              )}
              {(entry.metadata as any).issued_at && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Issued:</span>
                  <span className="text-xs">
                    {new Date(
                      (entry.metadata as any).issued_at,
                    ).toLocaleDateString()}
                  </span>
                </div>
              )}
              {(entry.metadata as any).media_hash && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Media Hash:</span>
                  <span className="font-mono text-xs">
                    {(entry.metadata as any).media_hash.slice(0, 8)}...
                    {(entry.metadata as any).media_hash.slice(-8)}
                  </span>
                </div>
              )}
            </div>
          </div>
        );

      case "flow":
        return (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Flow Details</h4>
            <div className="space-y-2 text-sm">
              {(entry.metadata as any).serialNumber && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Serial #:</span>
                  <span>#{(entry.metadata as any).serialNumber}</span>
                </div>
              )}
              {(entry.metadata as any).resourceType && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Resource Type:</span>
                  <span>{(entry.metadata as any).resourceType}</span>
                </div>
              )}
              {(entry.metadata as any).resourceID && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Resource ID:</span>
                  <span className="font-mono text-xs truncate max-w-[120px]">
                    {(entry.metadata as any).resourceID}
                  </span>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  },
);

ChainDetailsSections.displayName = "ChainDetailsSections";
