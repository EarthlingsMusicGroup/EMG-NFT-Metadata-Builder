"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";

import { FilesByCategory } from "@/components/settings/files-by-category";
import { ProjectsOverview } from "@/components/settings/projects-overview";
import { StorageActions } from "@/components/settings/storage-actions";
import { StorageLoading } from "@/components/settings/storage-loading";
import { StorageOverview } from "@/components/settings/storage-overview";
import { StorageTips } from "@/components/settings/storage-tips";
import { getFileCategory } from "@/lib/file-validation";
import { getStorageInfo } from "@/lib/indexeddb";
import { useProjectStore } from "@/lib/project-store";
import { toast } from "sonner";

interface StorageStats {
  totalFiles: number;
  totalSize: number;
  filesByCategory: Record<string, { count: number; size: number }>;
  availableSpace: number;
  usedPercentage: number;
}

export default function SettingsPage() {
  const { projects, clearAllProjects } = useProjectStore();
  const [storageStats, setStorageStats] = useState<StorageStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isClearing, setIsClearing] = useState(false);

  const loadStorageStats = async () => {
    try {
      const info = await getStorageInfo();
      const stats: StorageStats = {
        totalFiles: info.totalFiles,
        totalSize: info.totalSize,
        filesByCategory: {},
        availableSpace: info.availableSpace,
        usedPercentage: info.usedPercentage,
      };

      for (const file of info.files) {
        const category = getFileCategory(file.type) || "unknown";
        if (!stats.filesByCategory[category]) {
          stats.filesByCategory[category] = { count: 0, size: 0 };
        }
        stats.filesByCategory[category].count++;
        stats.filesByCategory[category].size += file.size;
      }

      setStorageStats(stats);
    } catch (error) {
      console.error("Failed to load storage stats:", error);
      toast.error("Failed to load storage information");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStorageStats();
  }, []);

  const handleClearAllData = async () => {
    setIsClearing(true);
    try {
      await clearAllProjects();
      await loadStorageStats();
      toast.success("All data cleared successfully");
    } catch (error) {
      console.error("Failed to clear data:", error);
      toast.error("Failed to clear data");
    } finally {
      setIsClearing(false);
    }
  };

  const handleExportData = async () => {
    try {
      const data = {
        projects: projects,
        exportDate: new Date().toISOString(),
        version: "1.0",
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `nft-metadata-backup-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Data exported successfully");
    } catch (error) {
      console.error("Failed to export data:", error);
      toast.error("Failed to export data");
    }
  };

  if (isLoading) {
    return <StorageLoading />;
  }

  if (!storageStats) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Failed to load storage information. Please refresh the page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Storage Manager</h1>
          <p className="text-muted-foreground">
            Manage your IndexedDB storage and project data
          </p>
        </div>
        <StorageActions
          onExport={handleExportData}
          onClearAll={handleClearAllData}
          isClearing={isClearing}
          projectCount={projects.length}
        />
      </div>

      <div className="space-y-6">
        <StorageOverview stats={storageStats} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FilesByCategory
            filesByCategory={storageStats.filesByCategory}
            totalSize={storageStats.totalSize}
          />
          <StorageTips />
        </div>

        <ProjectsOverview projects={projects} />
      </div>
    </div>
  );
}
