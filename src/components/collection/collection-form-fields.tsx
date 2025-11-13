"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ChainType, Project } from "@/lib/types";
import { Globe, Hash, Info } from "lucide-react";
import { memo } from "react";

interface CollectionFormFieldsProps {
  chain: ChainType;
  projectConfig: Project["projectConfig"];
  onUpdate: (updates: Partial<Project["projectConfig"]>) => void;
}

export const CollectionFormFields = memo(
  ({ chain, projectConfig, onUpdate }: CollectionFormFieldsProps) => {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="collection-name" className="flex items-center gap-2">
            <Hash className="h-4 w-4" />
            Collection Name *
          </Label>
          <Input
            id="collection-name"
            value={projectConfig.collectionName}
            onChange={(e) => onUpdate({ collectionName: e.target.value })}
            placeholder={
              chain === "solana"
                ? "My Solana Art Collection"
                : "My Awesome NFT Collection"
            }
            className="text-lg"
          />
          <p className="text-xs text-muted-foreground">
            The name of your NFT collection
          </p>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="collection-description"
            className="flex items-center gap-2"
          >
            <Info className="h-4 w-4" />
            Collection Description
          </Label>
          <Textarea
            id="collection-description"
            value={projectConfig.collectionDescription}
            onChange={(e) =>
              onUpdate({ collectionDescription: e.target.value })
            }
            placeholder={
              chain === "solana"
                ? "A unique collection of digital art on Solana blockchain..."
                : "A unique collection of digital assets..."
            }
            rows={3}
          />
          <p className="text-xs text-muted-foreground">
            A description that will be used for the collection
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="external-url" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            External URL
          </Label>
          <Input
            id="external-url"
            value={projectConfig.externalUrl}
            onChange={(e) => onUpdate({ externalUrl: e.target.value })}
            placeholder={
              chain === "solana"
                ? "https://myartcollection.com"
                : "https://yourwebsite.com"
            }
          />
          <p className="text-xs text-muted-foreground">
            Optional website or social media link for your collection
          </p>
        </div>
      </div>
    );
  },
);

CollectionFormFields.displayName = "CollectionFormFields";
