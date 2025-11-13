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
import type { Project } from "@/lib/types";
import { Globe } from "lucide-react";
import { memo } from "react";

interface AdvancedSettingsProps {
  projectConfig: Project["projectConfig"];
  onUpdate: (updates: Partial<Project["projectConfig"]>) => void;
}

export const AdvancedSettings = memo(
  ({ projectConfig, onUpdate }: AdvancedSettingsProps) => {
    return (
      <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
        <div className="space-y-2">
          <Label htmlFor="storage-type" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Storage Type
          </Label>
          <Select
            value={projectConfig.storageType || "local"}
            onValueChange={(value) =>
              onUpdate({ storageType: value as "local" | "ipfs" | "custom" })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select storage type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="local">Local Storage</SelectItem>
              <SelectItem value="ipfs">IPFS</SelectItem>
              <SelectItem value="custom">Custom URL</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            How your metadata and images will be stored
          </p>
        </div>

        {projectConfig.storageType === "custom" && (
          <div className="space-y-2">
            <Label htmlFor="custom-base-url">Custom Base URL</Label>
            <Input
              id="custom-base-url"
              value={projectConfig.customBaseUrl || ""}
              onChange={(e) => onUpdate({ customBaseUrl: e.target.value })}
              placeholder="https://yourdomain.com/metadata/"
            />
            <p className="text-xs text-muted-foreground">
              Base URL where your metadata will be hosted
            </p>
          </div>
        )}
      </div>
    );
  },
);

AdvancedSettings.displayName = "AdvancedSettings";
