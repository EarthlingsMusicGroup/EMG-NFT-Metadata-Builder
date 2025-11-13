"use client";
import { CreateProjectDialog } from "@/components/project/create-project-dialog";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Plus, Upload } from "lucide-react";

interface EmptyStateProps {
  onImportClick: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
}

export function EmptyState({
  onImportClick,
  fileInputRef,
  onFileChange,
}: EmptyStateProps) {
  return (
    <Empty className="border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Plus className="h-8 w-8" />
        </EmptyMedia>
        <EmptyTitle>Get Started</EmptyTitle>
        <EmptyDescription>
          Create your first NFT metadata project. Upload images, customize
          metadata, and export in formats compatible with your chosen
          blockchain.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <CreateProjectDialog
            trigger={
              <Button size="lg" className="gap-2">
                <Plus className="h-4 w-4" />
                Create New Project
              </Button>
            }
          />
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={onFileChange}
            className="hidden"
          />
          <Button
            size="lg"
            variant="outline"
            className="gap-2"
            onClick={onImportClick}
          >
            <Upload className="h-4 w-4" />
            Import Project
          </Button>
        </div>
      </EmptyContent>
    </Empty>
  );
}
