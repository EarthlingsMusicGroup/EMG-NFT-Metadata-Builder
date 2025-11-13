"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ChainType, Project } from "@/lib/types";
import { Globe, Hash, Percent, Wallet } from "lucide-react";
import { memo } from "react";

interface ChainConfigFieldsProps {
  chain: ChainType;
  projectConfig: Project["projectConfig"];
  onUpdate: (updates: Partial<Project["projectConfig"]>) => void;
}

export const ChainConfigFields = memo(
  ({ chain, projectConfig, onUpdate }: ChainConfigFieldsProps) => {
    switch (chain) {
      case "ethereum":
        return (
          <>
            <div className="space-y-2">
              <Label
                htmlFor="creator-address"
                className="flex items-center gap-2"
              >
                <Wallet className="h-4 w-4" />
                Creator Address (Ethereum)
              </Label>
              <Input
                id="creator-address"
                value={projectConfig.creatorAddress}
                onChange={(e) => onUpdate({ creatorAddress: e.target.value })}
                placeholder="0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6"
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">
                Your Ethereum wallet address for royalties and attribution
              </p>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="royalty-percentage"
                className="flex items-center gap-2"
              >
                <Percent className="h-4 w-4" />
                Royalty Percentage
              </Label>
              <Input
                id="royalty-percentage"
                type="number"
                min="0"
                max="10"
                value={projectConfig.royaltyPercentage}
                onChange={(e) =>
                  onUpdate({ royaltyPercentage: parseInt(e.target.value) || 0 })
                }
                placeholder="5"
              />
              <p className="text-xs text-muted-foreground">
                Royalty percentage (0-10% for OpenSea compatibility)
              </p>
            </div>
          </>
        );

      case "solana":
        return (
          <>
            <div className="space-y-2">
              <Label
                htmlFor="creator-address"
                className="flex items-center gap-2"
              >
                <Wallet className="h-4 w-4" />
                Creator Address (Solana)
              </Label>
              <Input
                id="creator-address"
                value={projectConfig.creatorAddress}
                onChange={(e) => onUpdate({ creatorAddress: e.target.value })}
                placeholder="9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM"
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">
                Your Solana wallet address (base58 format)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="symbol" className="flex items-center gap-2">
                <Hash className="h-4 w-4" />
                Token Symbol
              </Label>
              <Input
                id="symbol"
                value={projectConfig.symbol}
                onChange={(e) => onUpdate({ symbol: e.target.value })}
                placeholder="ART"
                maxLength={10}
              />
              <p className="text-xs text-muted-foreground">
                Token symbol for your collection (max 10 characters)
              </p>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="royalty-percentage"
                className="flex items-center gap-2"
              >
                <Percent className="h-4 w-4" />
                Royalty Percentage
              </Label>
              <Input
                id="royalty-percentage"
                type="number"
                min="0"
                max="100"
                value={projectConfig.royaltyPercentage}
                onChange={(e) =>
                  onUpdate({ royaltyPercentage: parseInt(e.target.value) || 0 })
                }
                placeholder="5"
              />
              <p className="text-xs text-muted-foreground">
                Royalty percentage (0-100%)
              </p>
            </div>
          </>
        );

      case "xrp":
        return (
          <>
            <div className="space-y-2">
              <Label
                htmlFor="creator-address"
                className="flex items-center gap-2"
              >
                <Wallet className="h-4 w-4" />
                Issuer Address (XRPL)
              </Label>
              <Input
                id="creator-address"
                value={projectConfig.creatorAddress}
                onChange={(e) => onUpdate({ creatorAddress: e.target.value })}
                placeholder="rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH"
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">
                Your XRPL issuer wallet address
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="network" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Network
              </Label>
              <Select
                value={projectConfig.storageType || "mainnet"}
                onValueChange={(value) =>
                  onUpdate({
                    storageType: value as
                      | "local"
                      | "ipfs"
                      | "custom"
                      | undefined,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select network" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mainnet">XRPL Mainnet</SelectItem>
                  <SelectItem value="testnet">XRPL Testnet</SelectItem>
                  <SelectItem value="devnet">XRPL Devnet</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Choose the XRPL network for your NFTs
              </p>
            </div>
          </>
        );

      case "polygon":
        return (
          <>
            <div className="space-y-2">
              <Label
                htmlFor="creator-address"
                className="flex items-center gap-2"
              >
                <Wallet className="h-4 w-4" />
                Creator Address (Polygon)
              </Label>
              <Input
                id="creator-address"
                value={projectConfig.creatorAddress}
                onChange={(e) => onUpdate({ creatorAddress: e.target.value })}
                placeholder="0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6"
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">
                Your Polygon wallet address (same format as Ethereum)
              </p>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="royalty-percentage"
                className="flex items-center gap-2"
              >
                <Percent className="h-4 w-4" />
                Royalty Percentage
              </Label>
              <Input
                id="royalty-percentage"
                type="number"
                min="0"
                max="10"
                value={projectConfig.royaltyPercentage}
                onChange={(e) =>
                  onUpdate({ royaltyPercentage: parseInt(e.target.value) || 0 })
                }
                placeholder="5"
              />
              <p className="text-xs text-muted-foreground">
                Royalty percentage (0-10% for OpenSea compatibility)
              </p>
            </div>
          </>
        );

      case "tezos":
        return (
          <>
            <div className="space-y-2">
              <Label
                htmlFor="creator-address"
                className="flex items-center gap-2"
              >
                <Wallet className="h-4 w-4" />
                Creator Address (Tezos)
              </Label>
              <Input
                id="creator-address"
                value={projectConfig.creatorAddress}
                onChange={(e) => onUpdate({ creatorAddress: e.target.value })}
                placeholder="tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx"
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">
                Your Tezos wallet address (tz1, tz2, or tz3 format)
              </p>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="royalty-percentage"
                className="flex items-center gap-2"
              >
                <Percent className="h-4 w-4" />
                Royalty Percentage
              </Label>
              <Input
                id="royalty-percentage"
                type="number"
                min="0"
                max="25"
                value={projectConfig.royaltyPercentage}
                onChange={(e) =>
                  onUpdate({ royaltyPercentage: parseInt(e.target.value) || 0 })
                }
                placeholder="5"
              />
              <p className="text-xs text-muted-foreground">
                Royalty percentage (0-25% for Tezos)
              </p>
            </div>
          </>
        );

      case "cardano":
        return (
          <>
            <div className="space-y-2">
              <Label
                htmlFor="creator-address"
                className="flex items-center gap-2"
              >
                <Wallet className="h-4 w-4" />
                Creator Address (Cardano)
              </Label>
              <Input
                id="creator-address"
                value={projectConfig.creatorAddress}
                onChange={(e) => onUpdate({ creatorAddress: e.target.value })}
                placeholder="addr1q9rl8..."
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">
                Your Cardano wallet address
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="policy-id" className="flex items-center gap-2">
                <Hash className="h-4 w-4" />
                Policy ID
              </Label>
              <Input
                id="policy-id"
                value={projectConfig.policyId || ""}
                onChange={(e) => onUpdate({ policyId: e.target.value })}
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
              <Label
                htmlFor="creator-address"
                className="flex items-center gap-2"
              >
                <Wallet className="h-4 w-4" />
                Creator Address (NEAR)
              </Label>
              <Input
                id="creator-address"
                value={projectConfig.creatorAddress}
                onChange={(e) => onUpdate({ creatorAddress: e.target.value })}
                placeholder="alice.near"
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">
                Your NEAR wallet address
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="copies" className="flex items-center gap-2">
                <Hash className="h-4 w-4" />
                Copies per NFT
              </Label>
              <Input
                id="copies"
                type="number"
                min="1"
                value={projectConfig.copies || 1}
                onChange={(e) =>
                  onUpdate({ copies: parseInt(e.target.value) || 1 })
                }
                placeholder="1"
              />
              <p className="text-xs text-muted-foreground">
                Number of copies per NFT (1 for unique NFTs)
              </p>
            </div>
          </>
        );

      case "flow":
        return (
          <>
            <div className="space-y-2">
              <Label
                htmlFor="creator-address"
                className="flex items-center gap-2"
              >
                <Wallet className="h-4 w-4" />
                Creator Address (Flow)
              </Label>
              <Input
                id="creator-address"
                value={projectConfig.creatorAddress}
                onChange={(e) => onUpdate({ creatorAddress: e.target.value })}
                placeholder="0x1234567890abcdef"
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">
                Your Flow wallet address
              </p>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="resource-type"
                className="flex items-center gap-2"
              >
                <Hash className="h-4 w-4" />
                Resource Type
              </Label>
              <Input
                id="resource-type"
                value={projectConfig.resourceType || "NFT"}
                onChange={(e) => onUpdate({ resourceType: e.target.value })}
                placeholder="NFT"
              />
              <p className="text-xs text-muted-foreground">
                Type of Flow resource
              </p>
            </div>
          </>
        );

      case "base":
      case "arbitrum":
      case "optimism":
      case "avalanche":
      case "bsc":
        return (
          <>
            <div className="space-y-2">
              <Label
                htmlFor="creator-address"
                className="flex items-center gap-2"
              >
                <Wallet className="h-4 w-4" />
                Creator Address (
                {chain.charAt(0).toUpperCase() + chain.slice(1)})
              </Label>
              <Input
                id="creator-address"
                value={projectConfig.creatorAddress}
                onChange={(e) => onUpdate({ creatorAddress: e.target.value })}
                placeholder="0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6"
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">
                Your {chain.charAt(0).toUpperCase() + chain.slice(1)} wallet
                address (Ethereum-compatible)
              </p>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="royalty-percentage"
                className="flex items-center gap-2"
              >
                <Percent className="h-4 w-4" />
                Royalty Percentage
              </Label>
              <Input
                id="royalty-percentage"
                type="number"
                min="0"
                max="10"
                value={projectConfig.royaltyPercentage}
                onChange={(e) =>
                  onUpdate({ royaltyPercentage: parseInt(e.target.value) || 0 })
                }
                placeholder="5"
              />
              <p className="text-xs text-muted-foreground">
                Royalty percentage (0-10% for OpenSea compatibility)
              </p>
            </div>
          </>
        );

      default:
        return null;
    }
  },
);

ChainConfigFields.displayName = "ChainConfigFields";
