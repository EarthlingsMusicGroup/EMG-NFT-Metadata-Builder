"use client";

import { useRef } from "react";
import { EmptyState } from "./empty-state";
import { FeaturesGrid } from "./features-grid";
import { HeroSection } from "./hero-section";
import { HowItWorks } from "./how-it-works";
import { SupportedChains } from "./supported-chains";

interface EmptyViewProps {
  onImportProject: (file: File) => Promise<void>;
}

export function EmptyView({ onImportProject }: EmptyViewProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      await onImportProject(file);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-4">
      <HeroSection />
      <EmptyState
        onImportClick={handleImportClick}
        fileInputRef={fileInputRef as React.RefObject<HTMLInputElement>}
        onFileChange={handleFileInputChange}
      />
      <FeaturesGrid />
      <HowItWorks />
    </div>
  );
}
