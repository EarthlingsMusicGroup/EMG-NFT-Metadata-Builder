"use client";

import { MetadataEditor } from "@/components/metadata-editor/metadata-editor";
import { PreviewPanel } from "@/components/preview/preview-panel";
import { StepNavigation } from "./step-navigation";
import { type Project } from "./utils";

interface StepMetadataProps {
  project: Project;
  selectedMetadataIndex: number;
  onSelectMetadataIndex: (index: number) => void;
  onPrev: () => void;
  onNext: () => void;
}

export function StepMetadata({
  project,
  selectedMetadataIndex,
  onSelectMetadataIndex,
  onPrev,
  onNext,
}: StepMetadataProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
      <MetadataEditor
        selectedIndex={selectedMetadataIndex}
        onSelectIndex={onSelectMetadataIndex}
      />
      <PreviewPanel selectedIndex={selectedMetadataIndex} />
      <StepNavigation
        project={project}
        currentStep={2}
        onNext={onNext}
        onPrev={onPrev}
        prevLabel="Back to Images"
        nextLabel="Continue to Export"
        validationMessage="Please add metadata for your items to continue"
      />
    </div>
  );
}
