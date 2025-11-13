import {
  clearAllMediaFiles,
  deleteMediaFile,
  getMediaFile,
  storeMediaFile,
} from "./indexeddb";
import type {
  ExportOptions,
  Project,
  ProjectConfig,
  ProjectStore,
} from "./types";

import { create } from "zustand";
import { persist } from "zustand/middleware";

const copyMediaToIndexedDB = async (originalMedia: any[], newMedia: any[]) => {
  for (let i = 0; i < originalMedia.length; i++) {
    try {
      const originalFile = await getMediaFile(originalMedia[i].id);
      if (originalFile) {
        await storeMediaFile(
          newMedia[i].id,
          originalFile,
          originalMedia[i].category,
        );
      }
    } catch (error) {
      // Silent fail for media copy operations
    }
  }
};

const defaultProjectConfig: ProjectConfig = {
  chain: "ethereum",
  collectionName: "My NFT Collection",
  collectionDescription: "A unique NFT collection",
  externalUrl: "",
  creatorAddress: "",
  royaltyPercentage: 5,
  symbol: "NFT",
  storageType: "local",
};

const defaultExportOptions: ExportOptions = {
  format: "combined",
  includeImages: true,
  uploadToIPFS: false,
};

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set, get) => ({
      projects: [],
      currentProjectId: null,

      getCurrentProject: () => {
        const { projects, currentProjectId } = get();
        return currentProjectId
          ? projects.find((p) => p.id === currentProjectId) || null
          : null;
      },

      createProject: (name: string, description?: string) => {
        const id = `project-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const now = new Date().toISOString();

        const newProject: Project = {
          id,
          name,
          description,
          createdAt: now,
          updatedAt: now,
          projectConfig: { ...defaultProjectConfig },
          images: [],
          metadataEntries: [],
          exportOptions: { ...defaultExportOptions },
          currentStep: 0,
          viewMode: "table",
          status: "draft",
          stats: {
            totalItems: 0,
            completedItems: 0,
            validationErrors: 0,
          },
        };

        set((state) => ({
          projects: [...state.projects, newProject],
          currentProjectId: id,
        }));

        return id;
      },

      updateProject: (id: string, updates: Partial<Project>) => {
        set((state) => {
          const updatedProjects = state.projects.map((project) =>
            project.id === id
              ? {
                  ...project,
                  ...updates,
                  updatedAt: new Date().toISOString(),
                  stats: {
                    ...project.stats,
                    totalItems: updates.images?.length || project.images.length,
                    completedItems: (
                      updates.metadataEntries || project.metadataEntries
                    ).filter(
                      (entry) =>
                        entry.metadata.name && entry.metadata.description,
                    ).length,
                    validationErrors: 0,
                  },
                }
              : project,
          );
          return { projects: updatedProjects };
        });
      },

      deleteProject: async (id: string) => {
        const { projects } = get();
        const project = projects.find((p) => p.id === id);

        if (project) {
          for (const media of project.images) {
            try {
              await deleteMediaFile(media.id);
            } catch (error) {
              // Silent fail for media deletion
            }
          }
        }

        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
          currentProjectId:
            state.currentProjectId === id ? null : state.currentProjectId,
        }));
      },

      duplicateProject: (id: string, newName: string) => {
        const { projects } = get();
        const originalProject = projects.find((p) => p.id === id);
        if (!originalProject) return "";

        const newId = `project-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const now = new Date().toISOString();

        const newImages = originalProject.images.map((media) => ({
          ...media,
          id: `media-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        }));

        const duplicatedProject: Project = {
          ...originalProject,
          id: newId,
          name: newName,
          createdAt: now,
          updatedAt: now,
          status: "draft",
          images: newImages,
          metadataEntries: originalProject.metadataEntries.map(
            (entry, index) => ({
              ...entry,
              id: `meta-${Date.now()}-${index}`,
              imageId:
                newImages[index]?.id ||
                `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            }),
          ),
        };

        set((state) => ({
          projects: [...state.projects, duplicatedProject],
          currentProjectId: newId,
        }));

        copyMediaToIndexedDB(originalProject.images, newImages);

        return newId;
      },

      exportProject: (id: string) => {
        const { projects } = get();
        const project = projects.find((p) => p.id === id);
        if (!project) return "";

        const exportData = {
          version: "2.0.0",
          timestamp: new Date().toISOString(),
          project: {
            ...project,
            images: project.images.map((img) => ({
              id: img.id,
              name: img.name,
              index: img.index,
              size: img.size,
              type: img.type,
              lastModified: img.lastModified,
            })),
          },
        };

        return JSON.stringify(exportData, null, 2);
      },

      importProject: (projectData: string) => {
        try {
          const data = JSON.parse(projectData);
          if (!data.project || !data.version) {
            throw new Error("Invalid project file format");
          }

          const project = data.project;
          const newId = `project-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          const now = new Date().toISOString();

          const importedProject: Project = {
            ...project,
            id: newId,
            createdAt: now,
            updatedAt: now,
            status: "draft",
            images: [],
            metadataEntries: [],
            stats: {
              totalItems: 0,
              completedItems: 0,
              validationErrors: 0,
            },
          };

          set((state) => ({
            projects: [...state.projects, importedProject],
            currentProjectId: newId,
          }));

          return newId;
        } catch (error) {
          throw new Error("Failed to import project file");
        }
      },

      setCurrentProject: (id: string | null) => {
        set({ currentProjectId: id });
      },

      getProjectSummary: (id: string) => {
        const { projects } = get();
        const project = projects.find((p) => p.id === id);
        if (!project) return null;

        return {
          id: project.id,
          name: project.name,
          description: project.description,
          createdAt: project.createdAt,
          updatedAt: project.updatedAt,
          chain: project.projectConfig.chain,
          totalItems: project.stats.totalItems,
          status: project.status,
          thumbnail: project.images[0]?.id,
        };
      },

      getAllProjectSummaries: () => {
        const { projects } = get();
        return projects.map((project) => ({
          id: project.id,
          name: project.name,
          description: project.description,
          createdAt: project.createdAt,
          updatedAt: project.updatedAt,
          chain: project.projectConfig.chain,
          totalItems: project.stats.totalItems,
          status: project.status,
          thumbnail: project.images[0]?.id,
        }));
      },

      clearAllProjects: async () => {
        try {
          await clearAllMediaFiles();
        } catch (error) {
          // Silent fail for media cleanup
        }

        set({
          projects: [],
          currentProjectId: null,
        });
      },
    }),
    {
      name: "nft-project-store",
      partialize: (state) => ({
        projects: state.projects,
        currentProjectId: state.currentProjectId,
      }),
    },
  ),
);
