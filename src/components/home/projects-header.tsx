"use client";

import { CreateProjectDialog } from "@/components/project/create-project-dialog";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface ProjectsHeaderProps {
  projectCount: number;
  onImportClick: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
}

export function ProjectsHeader({
  projectCount,
  onImportClick,
  fileInputRef,
  onFileChange,
}: ProjectsHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Your Projects
        </h1>
        <p className="text-muted-foreground">
          {projectCount} project{projectCount !== 1 ? "s" : ""} total
        </p>
      </div>
      <div className="flex items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={onFileChange}
          className="hidden"
        />
        <Button variant="outline" onClick={onImportClick} className="gap-2">
          <Upload className="h-4 w-4" />
          Import
        </Button>
        <CreateProjectDialog />
      </div>
    </div>
  );
}
