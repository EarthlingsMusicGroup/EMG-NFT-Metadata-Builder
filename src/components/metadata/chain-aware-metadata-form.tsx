"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { AnyMetadata, ChainType } from "@/lib/types";
import { ExternalLink, Globe, Hash, Image, Info } from "lucide-react";

import { ChainFields } from "@/components/metadata/chain-fields";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { CHAIN_SCHEMAS } from "@/lib/schemas";
import { useState } from "react";

interface ChainAwareMetadataFormProps {
  metadata: AnyMetadata;
  chain: ChainType;
  onChange: (metadata: AnyMetadata) => void;
  index: number;
}

export function ChainAwareMetadataForm({
  metadata,
  chain,
  onChange,
  index,
}: ChainAwareMetadataFormProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const schema = CHAIN_SCHEMAS[chain];

  const updateMetadata = (updates: Partial<AnyMetadata>) => {
    onChange({ ...metadata, ...updates });
  };

  const getRequiredFields = () => {
    return schema.requiredFields || ["name", "description", "image"];
  };

  const getOptionalFields = () => {
    return schema.optionalFields || [];
  };

  const isFieldRequired = (field: string) => {
    return getRequiredFields().includes(field);
  };

  const isFieldOptional = (field: string) => {
    return getOptionalFields().includes(field);
  };

  const getFieldPlaceholder = (field: string) => {
    const placeholders: Record<string, string> = {
      name: chain === "solana" ? "My Solana Art #1" : "My Awesome NFT #1",
      description:
        chain === "solana"
          ? "A unique piece of digital art on Solana blockchain..."
          : "A unique digital asset with special properties...",
      image: "https://yourdomain.com/images/1.png",
      external_url: "https://yourwebsite.com/nft/1",
      background_color: "FFFFFF",
      animation_url: "https://yourdomain.com/animations/1.mp4",
      youtube_url: "https://youtube.com/watch?v=example",
    };
    return placeholders[field] || "";
  };

  const getFieldDescription = (field: string) => {
    const descriptions: Record<string, string> = {
      name: "The name of this NFT",
      description: "A detailed description of this NFT",
      image: "URL to the image file for this NFT",
      external_url: "External URL for this NFT (website, social media, etc.)",
      background_color: "Background color in hex format (without #)",
      animation_url: "URL to animation file (MP4, WebM, etc.)",
      youtube_url: "YouTube video URL for this NFT",
    };
    return descriptions[field] || "";
  };

  const renderField = (field: string) => {
    const value = (metadata as any)[field] || "";
    const isRequired = isFieldRequired(field);
    const isOptional = isFieldOptional(field);

    if (!isRequired && !isOptional) return null;

    return (
      <div key={field} className="space-y-2">
        <Label htmlFor={field} className="flex items-center gap-2">
          {field === "name" && <Hash className="h-4 w-4" />}
          {field === "description" && <Info className="h-4 w-4" />}
          {field === "image" && <Image className="h-4 w-4" />}
          {field === "external_url" && <ExternalLink className="h-4 w-4" />}
          {field === "background_color" && (
            <div
              className="w-4 h-4 rounded border"
              style={{ backgroundColor: `#${value}` }}
            />
          )}
          {field === "animation_url" && <Globe className="h-4 w-4" />}
          {field === "youtube_url" && <Globe className="h-4 w-4" />}
          {field.charAt(0).toUpperCase() + field.slice(1).replace(/_/g, " ")}
          {isRequired && (
            <Badge variant="destructive" className="text-xs">
              Required
            </Badge>
          )}
          {isOptional && (
            <Badge variant="secondary" className="text-xs">
              Optional
            </Badge>
          )}
        </Label>

        {field === "description" ? (
          <Textarea
            id={field}
            value={value}
            onChange={(e) => updateMetadata({ [field]: e.target.value })}
            placeholder={getFieldPlaceholder(field)}
            rows={3}
          />
        ) : (
          <Input
            id={field}
            value={value}
            onChange={(e) => updateMetadata({ [field]: e.target.value })}
            placeholder={getFieldPlaceholder(field)}
            type={field === "background_color" ? "color" : "text"}
          />
        )}

        <p className="text-xs text-muted-foreground">
          {getFieldDescription(field)}
        </p>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Hash className="h-5 w-5" />
          NFT #{index + 1} Metadata
          <Badge variant="outline" className="ml-auto">
            {schema.name}
          </Badge>
        </CardTitle>
        <CardDescription>
          Configure metadata for this NFT following {schema.name} standards
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h4 className="font-semibold text-sm text-muted-foreground">
            Required Fields
          </h4>
          {getRequiredFields().map(renderField)}
        </div>

        <Separator />

        <div className="space-y-4">
          <h4 className="font-semibold text-sm text-muted-foreground">
            {schema.name} Specific Fields
          </h4>
          <ChainFields
            chain={chain}
            metadata={metadata}
            index={index}
            onUpdate={updateMetadata}
          />
        </div>
        <Separator />

        {getOptionalFields().length > 0 && (
          <div className="space-y-4">
            <Button
              variant="outline"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full"
            >
              {showAdvanced ? "Hide" : "Show"} Optional Fields
            </Button>

            {showAdvanced && (
              <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                {getOptionalFields().map(renderField)}
              </div>
            )}
          </div>
        )}

        {schema.supportsAttributes && (
          <>
            <Separator />
            <div className="space-y-4">
              <h4 className="font-semibold text-sm text-muted-foreground">
                Attributes
              </h4>
              <p className="text-xs text-muted-foreground">
                Add traits and properties that make this NFT unique
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
