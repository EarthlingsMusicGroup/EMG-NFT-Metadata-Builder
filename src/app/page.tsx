"use client";

import { EmptyView } from "@/components/home/empty-view";
import { ProjectsView } from "@/components/home/projects-view";
import { useProjectStore } from "@/lib/project-store";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function HomePage() {
  const router = useRouter();
  const {
    deleteProject,
    duplicateProject,
    exportProject,
    getAllProjectSummaries,
  } = useProjectStore();

  const projectSummaries = getAllProjectSummaries();

  const handleImportProject = async (file: File) => {
    try {
      const text = await file.text();
      const projectId = useProjectStore.getState().importProject(text);
      router.push(`/p/${projectId}`);
      toast.success("Project imported successfully");
    } catch (error) {
      toast.error("Failed to import project");
    }
  };

  const handleExportProject = (projectId: string) => {
    try {
      const projectData = exportProject(projectId);
      const blob = new Blob([projectData], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `nft-project-${projectId}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success("Project exported successfully");
    } catch (error) {
      toast.error("Failed to export project");
    }
  };

  const handleDuplicateProject = (projectId: string) => {
    const project = projectSummaries.find((p) => p.id === projectId);
    if (!project) return;

    const newName = `${project.name} (Copy)`;
    const newProjectId = duplicateProject(projectId, newName);
    router.push(`/p/${newProjectId}`);
    toast.success("Project duplicated successfully");
  };

  const handleDeleteProject = (projectId: string) => {
    if (
      confirm(
        "Are you sure you want to delete this project? This action cannot be undone.",
      )
    ) {
      deleteProject(projectId);
      toast.success("Project deleted successfully");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="min-h-[60svh] container mx-auto px-4 py-8">
        {projectSummaries.length === 0 ? (
          <EmptyView onImportProject={handleImportProject} />
        ) : (
          <ProjectsView
            projects={projectSummaries}
            onImportProject={handleImportProject}
            onDuplicate={handleDuplicateProject}
            onExport={handleExportProject}
            onDelete={handleDeleteProject}
          />
        )}
      </main>
    </div>
  );
}
