"use client";

import { useRef } from "react";
import { ProjectsGrid } from "./projects-grid";
import { ProjectsHeader } from "./projects-header";

interface Project {
  id: string;
  name: string;
  description?: string;
  chain: string;
  status: string;
  totalItems: number;
  updatedAt: string;
  thumbnail?: string;
}

interface ProjectsViewProps {
  projects: Project[];
  onImportProject: (file: File) => Promise<void>;
  onDuplicate: (projectId: string) => void;
  onExport: (projectId: string) => void;
  onDelete: (projectId: string) => void;
}

export function ProjectsView({
  projects,
  onImportProject,
  onDuplicate,
  onExport,
  onDelete,
}: ProjectsViewProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      await onImportProject(file);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <>
      <ProjectsHeader
        projectCount={projects.length}
        onImportClick={handleImportClick}
        fileInputRef={fileInputRef as React.RefObject<HTMLInputElement>}
        onFileChange={handleFileInputChange}
      />
      <ProjectsGrid
        projects={projects}
        onDuplicate={onDuplicate}
        onExport={onExport}
        onDelete={onDelete}
      />
    </>
  );
}
