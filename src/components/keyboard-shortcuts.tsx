"use client";

import { toast } from "sonner";
import { useEffect } from "react";
import { useProjectStore } from "@/lib/project-store";

export function KeyboardShortcuts() {
  const { projects, currentProjectId, updateProject } = useProjectStore();

  const project = projects.find((p) => p.id === currentProjectId);
  const metadataEntries = project?.metadataEntries || [];
  const currentStep = project?.currentStep || 0;

  const setCurrentStep = (step: number) => {
    if (project) {
      updateProject(project.id, { currentStep: step });
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        toast.info("Keyboard shortcut", {
          description: "Use the Save button in the header to save your project",
        });
      }

      if ((e.metaKey || e.ctrlKey) && e.key === "e") {
        e.preventDefault();
        if (currentStep >= 3) {
          toast.info("Export", {
            description:
              "Scroll to the export section to download your metadata",
          });
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentStep, metadataEntries, setCurrentStep]);

  return null;
}
