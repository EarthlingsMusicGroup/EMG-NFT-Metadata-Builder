"use client";

import { DynamicCollectionForm } from "@/components/collection/dynamic-collection-form";
import { StepNavigation } from "./step-navigation";
import { type Project } from "./utils";

interface StepCollectionProps {
  project: Project;
  onUpdate: (updates: Partial<Project>) => void;
  onNext: () => void;
}

export function StepCollection({
  project,
  onUpdate,
  onNext,
}: StepCollectionProps) {
  return (
    <div className="max-w-5xl mx-auto">
      <DynamicCollectionForm project={project} onUpdate={onUpdate} />
      <StepNavigation
        project={project}
        currentStep={0}
        onNext={onNext}
        onPrev={() => {}}
        nextLabel="Continue to Images"
        validationMessage="Please enter a collection name to continue"
      />
    </div>
  );
}
