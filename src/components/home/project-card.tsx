"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getChainIconUrl } from "@/lib/chain-info";
import {
  Calendar,
  Copy,
  Download,
  Hash,
  MoreVertical,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ProjectThumbnail } from "./project-thumbnail";
import { formatDistanceToNow, getStatusColor } from "./utils";

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    description?: string;
    chain: string;
    status: string;
    totalItems: number;
    updatedAt: string;
    thumbnail?: string;
  };
  onDuplicate: (projectId: string) => void;
  onExport: (projectId: string) => void;
  onDelete: (projectId: string) => void;
}

export function ProjectCard({
  project,
  onDuplicate,
  onExport,
  onDelete,
}: ProjectCardProps) {
  const router = useRouter();

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg truncate">{project.name}</CardTitle>
            {project.description && (
              <CardDescription className="mt-1 line-clamp-2">
                {project.description}
              </CardDescription>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => router.push(`/p/${project.id}`)}>
                Open Project
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDuplicate(project.id)}>
                <Copy className="h-4 w-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onExport(project.id)}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(project.id)}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent
        className="pt-0 cursor-pointer"
        onClick={() => router.push(`/p/${project.id}`)}
      >
        <div className="space-y-4">
          <div className="w-full h-full rounded-lg overflow-hidden bg-muted">
            <ProjectThumbnail imageId={project.thumbnail} />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="gap-1">
                <Image
                  src={getChainIconUrl(project.chain as any)}
                  alt={project.chain}
                  width={16}
                  height={16}
                  className="rounded"
                  unoptimized
                />
                <span className="capitalize">{project.chain}</span>
              </Badge>
              <Badge className={getStatusColor(project.status)}>
                {project.status}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Hash className="h-3 w-3" />
                {project.totalItems} items
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDistanceToNow(new Date(project.updatedAt))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
