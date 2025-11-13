"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, HardDrive } from "lucide-react";

interface StorageStats {
  totalFiles: number;
  totalSize: number;
  availableSpace: number;
  usedPercentage: number;
}

interface StorageOverviewProps {
  stats: StorageStats;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export function StorageOverview({ stats }: StorageOverviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HardDrive className="h-5 w-5" />
          Storage Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col items-center justify-center p-6 border rounded-lg bg-muted/30">
            <div className="text-3xl font-bold mb-1">{stats.totalFiles}</div>
            <div className="text-sm text-muted-foreground font-medium">
              Total Files
            </div>
          </div>
          <div className="flex flex-col items-center justify-center p-6 border rounded-lg bg-muted/30">
            <div className="text-3xl font-bold mb-1">
              {formatBytes(stats.totalSize)}
            </div>
            <div className="text-sm text-muted-foreground font-medium">
              Used Space
            </div>
          </div>
          <div className="flex flex-col items-center justify-center p-6 border rounded-lg bg-muted/30">
            <div className="text-3xl font-bold mb-1">
              {formatBytes(stats.availableSpace)}
            </div>
            <div className="text-sm text-muted-foreground font-medium">
              Available Space
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Storage Usage</span>
            <span className="font-semibold">
              {stats.usedPercentage.toFixed(1)}%
            </span>
          </div>
          <Progress value={stats.usedPercentage} className="h-3" />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{formatBytes(stats.totalSize)} used</span>
            <span>{formatBytes(stats.availableSpace)} available</span>
          </div>
        </div>

        {stats.usedPercentage > 80 && (
          <Alert
            variant={stats.usedPercentage > 90 ? "destructive" : "default"}
          >
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Storage is {stats.usedPercentage.toFixed(1)}% full. Consider
              clearing unused files or exporting your data.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
