"use client";

import { ProjectCard } from "./project-card";

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

interface ProjectsGridProps {
  projects: Project[];
  onDuplicate: (projectId: string) => void;
  onExport: (projectId: string) => void;
  onDelete: (projectId: string) => void;
}

export function ProjectsGrid({
  projects,
  onDuplicate,
  onExport,
  onDelete,
}: ProjectsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <div key={project.id}>
          <ProjectCard
            project={project}
            onDuplicate={onDuplicate}
            onExport={onExport}
            onDelete={onDelete}
          />
        </div>
      ))}
    </div>
  );
}
