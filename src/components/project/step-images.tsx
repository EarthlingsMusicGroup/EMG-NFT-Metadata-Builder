"use client";

import { MediaUploader } from "@/components/media/media-uploader";
import { StepNavigation } from "./step-navigation";
import { type Project } from "./utils";

interface StepImagesProps {
  project: Project;
  onPrev: () => void;
  onNext: () => void;
}

export function StepImages({ project, onPrev, onNext }: StepImagesProps) {
  return (
    <div className="max-w-5xl mx-auto">
      <MediaUploader />
      <StepNavigation
        project={project}
        currentStep={1}
        onNext={onNext}
        onPrev={onPrev}
        prevLabel="Back to Collection"
        nextLabel="Continue to Metadata"
        validationMessage="Please upload at least one image to continue"
      />
    </div>
  );
}
