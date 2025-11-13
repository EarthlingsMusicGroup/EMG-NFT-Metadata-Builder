"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getChainIconUrl } from "@/lib/chain-info";
import { Download, Save } from "lucide-react";
import Image from "next/image";

interface ProjectHeaderProps {
  project: {
    name: string;
    description?: string;
    projectConfig: {
      chain: string;
    };
  };
  isSaving: boolean;
  onSave: () => void;
  onExport: () => void;
}

export function ProjectHeader({
  project,
  isSaving,
  onSave,
  onExport,
}: ProjectHeaderProps) {
  return (
    <header className="border-b border-border bg-card sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-xl font-semibold">{project.name}</h1>
                {project.description && (
                  <p className="text-sm text-muted-foreground">
                    {project.description}
                  </p>
                )}
              </div>
              <Badge variant="outline" className="gap-1">
                <Image
                  src={getChainIconUrl(project.projectConfig.chain as any)}
                  alt={project.projectConfig.chain}
                  width={16}
                  height={16}
                  className="rounded"
                  unoptimized
                />
                <span className="capitalize">
                  {project.projectConfig.chain}
                </span>
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onSave}
              disabled={isSaving}
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Saving..." : "Save"}
            </Button>
            <Button size="sm" onClick={onExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
