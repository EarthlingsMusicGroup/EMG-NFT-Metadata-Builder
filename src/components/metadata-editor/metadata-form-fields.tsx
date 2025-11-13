"use client";

import { ChainSpecificFields } from "@/components/metadata/chain-specific-fields";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { AnyMetadata, ChainType } from "@/lib/types";
import { memo } from "react";

interface MetadataFormFieldsProps {
  metadata: AnyMetadata;
  chain: ChainType;
  index: number;
  onFieldChange: (field: string, value: any) => void;
}

export const MetadataFormFields = memo(
  ({ metadata, chain, index, onFieldChange }: MetadataFormFieldsProps) => {
    return (
      <div className="space-y-4">
        <h3 className="text-sm font-semibold">Required Fields</h3>

        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={metadata.name || ""}
            onChange={(e) => onFieldChange("name", e.target.value)}
            placeholder="Enter NFT name"
            aria-required="true"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={metadata.description || ""}
            onChange={(e) => onFieldChange("description", e.target.value)}
            placeholder="Enter NFT description"
            rows={3}
            aria-required="true"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="image">Image</Label>
          <Input
            id="image"
            value={metadata.image || ""}
            onChange={(e) => onFieldChange("image", e.target.value)}
            placeholder="Image filename or URL"
            aria-required="true"
            aria-describedby="image-help"
          />
          <p id="image-help" className="text-xs text-muted-foreground">
            This will be replaced with the actual image URL during export
          </p>
        </div>

        <ChainSpecificFields
          chain={chain}
          metadata={metadata}
          index={index}
          onUpdate={(updates) => {
            Object.entries(updates).forEach(([key, value]) => {
              onFieldChange(key, value);
            });
          }}
        />
      </div>
    );
  },
);

MetadataFormFields.displayName = "MetadataFormFields";
