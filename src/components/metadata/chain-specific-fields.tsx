"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ChainType } from "@/lib/types";

interface ChainSpecificFieldsProps {
  chain: ChainType;
  metadata: any;
  index: number;
  onUpdate: (updates: any) => void;
}

export function ChainSpecificFields({
  chain,
  metadata,
  index,
  onUpdate,
}: ChainSpecificFieldsProps) {
  switch (chain) {
    case "solana":
      return (
        <div className="space-y-2">
          <Label htmlFor="symbol">Symbol</Label>
          <Input
            id="symbol"
            value={metadata.symbol || ""}
            onChange={(e) => onUpdate({ symbol: e.target.value })}
            placeholder="NFT"
            maxLength={10}
          />
        </div>
      );

    case "xrp":
      return (
        <>
          <div className="space-y-2">
            <Label htmlFor="schema">Schema</Label>
            <Input
              id="schema"
              value={metadata.schema || ""}
              onChange={(e) => onUpdate({ schema: e.target.value })}
              placeholder="ipfs://..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nftType">NFT Type</Label>
            <Input
              id="nftType"
              value={metadata.nftType || ""}
              onChange={(e) => onUpdate({ nftType: e.target.value })}
              placeholder="art.v0"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="issuer">Issuer Address</Label>
            <Input
              id="issuer"
              value={metadata.issuer || ""}
              onChange={(e) => onUpdate({ issuer: e.target.value })}
              placeholder="rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH"
              className="font-mono"
            />
          </div>
        </>
      );

    case "cardano":
      return (
        <>
          <div className="space-y-2">
            <Label htmlFor="mediaType">Media Type</Label>
            <Input
              id="mediaType"
              value={metadata.mediaType || ""}
              onChange={(e) => onUpdate({ mediaType: e.target.value })}
              placeholder="image/png"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="policyId">Policy ID</Label>
            <Input
              id="policyId"
              value={metadata.mint?.policy_id || ""}
              onChange={(e) =>
                onUpdate({
                  mint: {
                    ...metadata.mint,
                    policy_id: e.target.value,
                  },
                })
              }
              placeholder="56 character hex string"
              className="font-mono"
            />
          </div>
        </>
      );

    case "near":
      return (
        <>
          <div className="space-y-2">
            <Label htmlFor="copies">Copies</Label>
            <Input
              id="copies"
              type="number"
              min="1"
              value={metadata.copies || 1}
              onChange={(e) =>
                onUpdate({ copies: parseInt(e.target.value) || 1 })
              }
              placeholder="1"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="issuedAt">Issued At</Label>
            <Input
              id="issuedAt"
              type="datetime-local"
              value={
                metadata.issued_at
                  ? new Date(metadata.issued_at).toISOString().slice(0, 16)
                  : ""
              }
              onChange={(e) =>
                onUpdate({ issued_at: new Date(e.target.value).toISOString() })
              }
            />
          </div>
        </>
      );

    case "tezos":
      return (
        <>
          <div className="space-y-2">
            <Label htmlFor="artifactUri">Artifact URI</Label>
            <Input
              id="artifactUri"
              value={metadata.artifactUri || ""}
              onChange={(e) => onUpdate({ artifactUri: e.target.value })}
              placeholder="ipfs://..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="displayUri">Display URI</Label>
            <Input
              id="displayUri"
              value={metadata.displayUri || ""}
              onChange={(e) => onUpdate({ displayUri: e.target.value })}
              placeholder="ipfs://..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="minter">Minter Address</Label>
            <Input
              id="minter"
              value={metadata.minter || ""}
              onChange={(e) => onUpdate({ minter: e.target.value })}
              placeholder="tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx"
              className="font-mono"
            />
          </div>
        </>
      );

    case "flow":
      return (
        <>
          <div className="space-y-2">
            <Label htmlFor="serialNumber">Serial Number</Label>
            <Input
              id="serialNumber"
              type="number"
              min="1"
              value={metadata.serialNumber || index + 1}
              onChange={(e) =>
                onUpdate({
                  serialNumber: parseInt(e.target.value) || index + 1,
                })
              }
              placeholder={`${index + 1}`}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="resourceType">Resource Type</Label>
            <Input
              id="resourceType"
              value={metadata.resourceType || "NFT"}
              onChange={(e) => onUpdate({ resourceType: e.target.value })}
              placeholder="NFT"
            />
          </div>
        </>
      );

    default:
      return null;
  }
}
