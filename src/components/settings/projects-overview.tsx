"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Project } from "@/lib/types";
import { Database } from "lucide-react";

interface ProjectsOverviewProps {
  projects: Project[];
}

export function ProjectsOverview({ projects }: ProjectsOverviewProps) {
  const getStatusVariant = (
    status: string,
  ): "default" | "secondary" | "outline" => {
    switch (status) {
      case "ready":
        return "default";
      case "exported":
        return "outline";
      default:
        return "secondary";
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (projects.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Projects Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <Database className="h-16 w-16 mx-auto mb-4 opacity-30" />
            <p className="text-base font-medium mb-1">No projects found</p>
            <p className="text-sm">Create your first project to get started</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Projects Overview</span>
          <Badge variant="secondary" className="ml-2">
            {projects.length} {projects.length === 1 ? "project" : "projects"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group p-5 border rounded-lg hover:border-primary/50 hover:shadow-sm transition-all space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <h3
                  className="font-semibold text-base truncate flex-1"
                  title={project.name}
                >
                  {project.name}
                </h3>
                <Badge
                  variant={getStatusVariant(project.status)}
                  className="shrink-0 capitalize"
                >
                  {project.status}
                </Badge>
              </div>

              {project.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {project.description}
                </p>
              )}

              <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                <span className="flex items-center gap-1">
                  <span className="font-medium">{project.images.length}</span>
                  <span>{project.images.length === 1 ? "file" : "files"}</span>
                </span>
                <span>{formatDate(project.updatedAt)}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
