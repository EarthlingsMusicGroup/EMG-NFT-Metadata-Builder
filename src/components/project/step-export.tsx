"use client";

import { ExportPanel } from "@/components/export/export-panel";
import { Button } from "@/components/ui/button";

interface StepExportProps {
  onPrev: () => void;
  onComplete: () => void;
}

export function StepExport({ onPrev, onComplete }: StepExportProps) {
  return (
    <div className="max-w-5xl mx-auto">
      <ExportPanel />
      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onPrev}>
          Back to Metadata
        </Button>
        <Button onClick={onComplete}>Mark as Complete</Button>
      </div>
    </div>
  );
}
