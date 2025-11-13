"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AnyMetadata, ChainType } from "@/lib/types";
import { memo } from "react";

interface MetadataOptionalFieldsProps {
  metadata: AnyMetadata;
  chain: ChainType;
  onFieldChange: (field: string, value: any) => void;
}

export const MetadataOptionalFields = memo(
  ({ metadata, chain, onFieldChange }: MetadataOptionalFieldsProps) => {
    return (
      <div className="space-y-4 pt-4">
        <div className="space-y-2">
          <Label htmlFor="external_url">External URL</Label>
          <Input
            id="external_url"
            value={metadata.external_url || ""}
            onChange={(e) => onFieldChange("external_url", e.target.value)}
            placeholder="https://..."
            type="url"
          />
        </div>

        {(chain === "ethereum" || chain === "polygon") && (
          <>
            <div className="space-y-2">
              <Label htmlFor="background_color">Background Color</Label>
              <Input
                id="background_color"
                value={(metadata as any).background_color || ""}
                onChange={(e) =>
                  onFieldChange("background_color", e.target.value)
                }
                placeholder="FFFFFF"
                maxLength={6}
                aria-describedby="bg-color-help"
              />
              <p id="bg-color-help" className="text-xs text-muted-foreground">
                6-character hex color without #
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="animation_url">Animation URL</Label>
              <Input
                id="animation_url"
                value={(metadata as any).animation_url || ""}
                onChange={(e) => onFieldChange("animation_url", e.target.value)}
                placeholder="https://..."
                type="url"
              />
            </div>
          </>
        )}
      </div>
    );
  },
);

MetadataOptionalFields.displayName = "MetadataOptionalFields";
