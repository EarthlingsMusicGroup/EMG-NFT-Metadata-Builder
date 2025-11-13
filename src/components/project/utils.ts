import type { Project } from "@/lib/types";

export type { Project };

export const canProceedToNext = (
  project: Project | null,
  currentStep: number,
): boolean => {
  if (!project) return false;

  switch (currentStep) {
    case 0:
      return project.projectConfig.collectionName.trim() !== "";
    case 1:
      return project.images.length > 0;
    case 2:
      return project.metadataEntries.length > 0;
    default:
      return true;
  }
};

export const steps = [
  { id: 0, name: "Collection", description: "Configure collection details" },
  { id: 1, name: "Images", description: "Upload your assets" },
  { id: 2, name: "Metadata", description: "Edit item details" },
  { id: 3, name: "Export", description: "Generate files" },
];
