"use client";

import { NotFoundView } from "@/components/project/not-found-view";
import { ProgressStepper } from "@/components/project/progress-stepper";
import { ProjectHeader } from "@/components/project/project-header";
import { StepCollection } from "@/components/project/step-collection";
import { StepExport } from "@/components/project/step-export";
import { StepImages } from "@/components/project/step-images";
import { StepMetadata } from "@/components/project/step-metadata";
import { canProceedToNext, steps } from "@/components/project/utils";
import { useProjectStore } from "@/lib/project-store";
import { createDefaultMetadata } from "@/lib/schemas";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const {
    projects,
    currentProjectId,
    updateProject,
    setCurrentProject,
    exportProject,
  } = useProjectStore();

  const [isSaving, setIsSaving] = useState(false);
  const [selectedMetadataIndex, setSelectedMetadataIndex] = useState(0);

  useEffect(() => {
    setSelectedMetadataIndex(0);
  }, [projectId]);

  const project = projects.find((p) => p.id === currentProjectId) || null;
  const currentStep = project?.currentStep || 0;

  useEffect(() => {
    if (projectId) {
      setCurrentProject(projectId);
    }
  }, [projectId, setCurrentProject]);

  useEffect(() => {
    if (
      project &&
      currentStep === 2 &&
      project.images.length > 0 &&
      project.metadataEntries.length === 0
    ) {
      const metadataEntries = project.images.map((img, index) => {
        const metadata = createDefaultMetadata(
          project.projectConfig.chain,
          index + 1,
          img.name || `${index + 1}.png`,
          {
            issuer: project.projectConfig.creatorAddress,
            useXls24d: project.projectConfig.chain === "xrp",
          },
        );

        return {
          id: `metadata-${img.id}`,
          imageId: img.id,
          index: index + 1,
          metadata: {
            ...metadata,
            name: `${project.projectConfig.collectionName} #${index + 1}`,
            description: `${project.projectConfig.collectionDescription} - Item ${index + 1}`,
            external_url:
              project.projectConfig.externalUrl || metadata.external_url || "",
          },
        };
      });
      updateProject(project.id, { metadataEntries });
    }
  }, [project, currentStep, updateProject]);

  if (!project) {
    return <NotFoundView />;
  }

  const handleSave = async () => {
    setIsSaving(true);
    try {
      updateProject(project.id, { ...project });
      toast.success("Project saved successfully");
    } finally {
      setTimeout(() => setIsSaving(false), 1000);
    }
  };

  const handleExport = () => {
    try {
      const projectData = exportProject(project.id);
      const blob = new Blob([projectData], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${project.name.replace(/\s+/g, "-").toLowerCase()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success("Project exported successfully");
    } catch (error) {
      toast.error("Failed to export project");
    }
  };

  const nextStep = () => {
    if (
      canProceedToNext(project, currentStep) &&
      currentStep < steps.length - 1
    ) {
      const newStep = currentStep + 1;
      updateProject(project.id, { currentStep: newStep });
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      const newStep = currentStep - 1;
      updateProject(project.id, { currentStep: newStep });
    }
  };

  const goToStep = (step: number) => {
    if (step >= 0 && step < steps.length) {
      updateProject(project.id, { currentStep: step });
    }
  };

  const handleComplete = () => {
    updateProject(project.id, { status: "ready" });
    toast.success("Project completed successfully!");
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <ProjectHeader
        project={project}
        isSaving={isSaving}
        onSave={handleSave}
        onExport={handleExport}
      />
      <ProgressStepper
        project={project}
        currentStep={currentStep}
        onGoToStep={goToStep}
      />
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-8">
          {currentStep === 0 && (
            <StepCollection
              project={project}
              onUpdate={(updates) => updateProject(project.id, updates)}
              onNext={nextStep}
            />
          )}
          {currentStep === 1 && (
            <StepImages project={project} onPrev={prevStep} onNext={nextStep} />
          )}
          {currentStep === 2 && (
            <StepMetadata
              project={project}
              selectedMetadataIndex={selectedMetadataIndex}
              onSelectMetadataIndex={setSelectedMetadataIndex}
              onPrev={prevStep}
              onNext={nextStep}
            />
          )}
          {currentStep === 3 && (
            <StepExport onPrev={prevStep} onComplete={handleComplete} />
          )}
        </div>
      </main>
    </div>
  );
}
