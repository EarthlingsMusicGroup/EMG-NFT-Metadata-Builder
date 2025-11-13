"use client";

import { Button } from "@/components/ui/button";
import { canProceedToNext, type Project } from "./utils";

interface StepNavigationProps {
  project: Project | null;
  currentStep: number;
  onNext: () => void;
  onPrev?: () => void;
  nextLabel?: string;
  prevLabel?: string;
  validationMessage?: string;
}

export function StepNavigation({
  project,
  currentStep,
  onNext,
  onPrev,
  nextLabel,
  prevLabel,
  validationMessage,
}: StepNavigationProps) {
  const canProceed = canProceedToNext(project, currentStep);

  return (
    <div className="flex justify-between pt-6">
      {currentStep > 0 && (
        <Button variant="outline" onClick={onPrev}>
          {prevLabel || "Back"}
        </Button>
      )}
      <div className="flex flex-col items-end gap-2 ml-auto">
        {!canProceed && validationMessage && (
          <p className="text-sm text-muted-foreground">{validationMessage}</p>
        )}
        <Button onClick={onNext} disabled={!canProceed}>
          {nextLabel || "Continue"}
        </Button>
      </div>
    </div>
  );
}
