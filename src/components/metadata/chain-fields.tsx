"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AnyMetadata, ChainType } from "@/lib/types";
import { Hash, Image, Wallet } from "lucide-react";

interface ChainFieldsProps {
  chain: ChainType;
  metadata: AnyMetadata;
  index: number;
  onUpdate: (updates: Partial<AnyMetadata>) => void;
}

export function ChainFields({
  chain,
  metadata,
  index,
  onUpdate,
}: ChainFieldsProps) {
  switch (chain) {
    case "solana":
      return (
        <div className="space-y-2">
          <Label htmlFor="symbol" className="flex items-center gap-2">
            <Hash className="h-4 w-4" />
            Symbol *
          </Label>
          <Input
            id="symbol"
            value={(metadata as any).symbol || ""}
            onChange={(e) => onUpdate({ symbol: e.target.value })}
            placeholder="ART"
            maxLength={10}
          />
          <p className="text-xs text-muted-foreground">
            Token symbol for this NFT (max 10 characters)
          </p>
        </div>
      );

    case "xrp":
      return (
        <>
          <div className="space-y-2">
            <Label htmlFor="nft-type" className="flex items-center gap-2">
              <Hash className="h-4 w-4" />
              NFT Type
            </Label>
            <Input
              id="nft-type"
              value={(metadata as any).nftType || "art.v0"}
              onChange={(e) => onUpdate({ nftType: e.target.value })}
              placeholder="art.v0"
            />
            <p className="text-xs text-muted-foreground">
              XRPL NFT type (e.g., art.v0, music.v0)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="media-type" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              Media Type
            </Label>
            <Input
              id="media-type"
              value={(metadata as any).media_type || "image/png"}
              onChange={(e) => onUpdate({ media_type: e.target.value })}
              placeholder="image/png"
            />
            <p className="text-xs text-muted-foreground">
              MIME type of the media file
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="file-name" className="flex items-center gap-2">
              <Hash className="h-4 w-4" />
              File Name
            </Label>
            <Input
              id="file-name"
              value={(metadata as any).file || `${index + 1}.png`}
              onChange={(e) => onUpdate({ file: e.target.value })}
              placeholder={`${index + 1}.png`}
            />
            <p className="text-xs text-muted-foreground">
              Actual file name (e.g., 1.png, 2.jpg)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="issuer" className="flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              Issuer Address
            </Label>
            <Input
              id="issuer"
              value={(metadata as any).issuer || ""}
              onChange={(e) => onUpdate({ issuer: e.target.value })}
              placeholder="rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH"
              className="font-mono"
            />
            <p className="text-xs text-muted-foreground">
              XRPL issuer wallet address
            </p>
          </div>
        </>
      );

    case "cardano":
      return (
        <>
          <div className="space-y-2">
            <Label htmlFor="media-type" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              Media Type
            </Label>
            <Input
              id="media-type"
              value={(metadata as any).mediaType || "image/png"}
              onChange={(e) => onUpdate({ mediaType: e.target.value })}
              placeholder="image/png"
            />
            <p className="text-xs text-muted-foreground">
              MIME type of the media file
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="policy-id" className="flex items-center gap-2">
              <Hash className="h-4 w-4" />
              Policy ID
            </Label>
            <Input
              id="policy-id"
              value={(metadata as any).mint?.policy_id || ""}
              onChange={(e) =>
                onUpdate({
                  mint: {
                    ...(metadata as any).mint,
                    policy_id: e.target.value,
                  },
                })
              }
              placeholder="56 character hex string"
              className="font-mono"
            />
            <p className="text-xs text-muted-foreground">
              Cardano policy ID (56 hex characters)
            </p>
          </div>
        </>
      );

    case "near":
      return (
        <>
          <div className="space-y-2">
            <Label htmlFor="copies" className="flex items-center gap-2">
              <Hash className="h-4 w-4" />
              Copies
            </Label>
            <Input
              id="copies"
              type="number"
              min="1"
              value={(metadata as any).copies || 1}
              onChange={(e) =>
                onUpdate({ copies: parseInt(e.target.value) || 1 })
              }
              placeholder="1"
            />
            <p className="text-xs text-muted-foreground">
              Number of copies (1 for unique NFT)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="issued-at" className="flex items-center gap-2">
              <Hash className="h-4 w-4" />
              Issued At
            </Label>
            <Input
              id="issued-at"
              type="datetime-local"
              value={
                (metadata as any).issued_at
                  ? new Date((metadata as any).issued_at)
                      .toISOString()
                      .slice(0, 16)
                  : ""
              }
              onChange={(e) =>
                onUpdate({ issued_at: new Date(e.target.value).toISOString() })
              }
            />
            <p className="text-xs text-muted-foreground">
              When this NFT was issued
            </p>
          </div>
        </>
      );

    case "tezos":
      return (
        <>
          <div className="space-y-2">
            <Label htmlFor="artifact-uri" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              Artifact URI
            </Label>
            <Input
              id="artifact-uri"
              value={(metadata as any).artifactUri || ""}
              onChange={(e) => onUpdate({ artifactUri: e.target.value })}
              placeholder="ipfs://..."
            />
            <p className="text-xs text-muted-foreground">
              URI to the main artifact file
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="display-uri" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              Display URI
            </Label>
            <Input
              id="display-uri"
              value={(metadata as any).displayUri || ""}
              onChange={(e) => onUpdate({ displayUri: e.target.value })}
              placeholder="ipfs://..."
            />
            <p className="text-xs text-muted-foreground">
              URI for display purposes
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="minter" className="flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              Minter Address
            </Label>
            <Input
              id="minter"
              value={(metadata as any).minter || ""}
              onChange={(e) => onUpdate({ minter: e.target.value })}
              placeholder="tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx"
              className="font-mono"
            />
            <p className="text-xs text-muted-foreground">
              Tezos minter address
            </p>
          </div>
        </>
      );

    case "flow":
      return (
        <>
          <div className="space-y-2">
            <Label htmlFor="serial-number" className="flex items-center gap-2">
              <Hash className="h-4 w-4" />
              Serial Number
            </Label>
            <Input
              id="serial-number"
              type="number"
              min="1"
              value={(metadata as any).serialNumber || index + 1}
              onChange={(e) =>
                onUpdate({
                  serialNumber: parseInt(e.target.value) || index + 1,
                })
              }
              placeholder={`${index + 1}`}
            />
            <p className="text-xs text-muted-foreground">
              Unique serial number for this NFT
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="resource-type" className="flex items-center gap-2">
              <Hash className="h-4 w-4" />
              Resource Type
            </Label>
            <Input
              id="resource-type"
              value={(metadata as any).resourceType || "NFT"}
              onChange={(e) => onUpdate({ resourceType: e.target.value })}
              placeholder="NFT"
            />
            <p className="text-xs text-muted-foreground">
              Type of Flow resource
            </p>
          </div>
        </>
      );

    default:
      return null;
  }
}
