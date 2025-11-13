"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Archive,
  Box,
  Database,
  FileAudio,
  FileImage,
  FileText,
  FileVideo,
} from "lucide-react";

interface CategoryStats {
  count: number;
  size: number;
}

interface FilesByCategoryProps {
  filesByCategory: Record<string, CategoryStats>;
  totalSize: number;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

function getCategoryIcon(category: string) {
  switch (category) {
    case "image":
      return <FileImage className="h-5 w-5" />;
    case "audio":
      return <FileAudio className="h-5 w-5" />;
    case "video":
      return <FileVideo className="h-5 w-5" />;
    case "model":
      return <Box className="h-5 w-5" />;
    case "document":
      return <FileText className="h-5 w-5" />;
    case "archive":
      return <Archive className="h-5 w-5" />;
    default:
      return <Database className="h-5 w-5" />;
  }
}

function getCategoryColor(category: string): string {
  switch (category) {
    case "image":
      return "bg-blue-500/10 text-blue-600 dark:text-blue-400";
    case "audio":
      return "bg-purple-500/10 text-purple-600 dark:text-purple-400";
    case "video":
      return "bg-red-500/10 text-red-600 dark:text-red-400";
    case "model":
      return "bg-green-500/10 text-green-600 dark:text-green-400";
    case "document":
      return "bg-orange-500/10 text-orange-600 dark:text-orange-400";
    case "archive":
      return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400";
    default:
      return "bg-gray-500/10 text-gray-600 dark:text-gray-400";
  }
}

export function FilesByCategory({
  filesByCategory,
  totalSize,
}: FilesByCategoryProps) {
  const categories = Object.entries(filesByCategory).sort(
    (a, b) => b[1].size - a[1].size,
  );

  if (categories.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Files by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Database className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No files found</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Files by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {categories.map(([category, stats]) => {
            const percentage =
              totalSize > 0 ? (stats.size / totalSize) * 100 : 0;
            return (
              <div
                key={category}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div
                    className={cn(
                      "flex items-center justify-center w-10 h-10 rounded-lg shrink-0",
                      getCategoryColor(category),
                    )}
                  >
                    {getCategoryIcon(category)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium capitalize text-base">
                      {category}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {stats.count} file{stats.count !== 1 ? "s" : ""}
                    </div>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <div className="font-semibold text-base">
                    {formatBytes(stats.size)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {percentage.toFixed(1)}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
