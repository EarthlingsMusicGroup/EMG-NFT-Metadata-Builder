import type { ChainType } from "@/lib/types";
import { useCallback } from "react";
import { toast } from "sonner";

interface UseMetadataEditorProps {
  currentEntry: any;
  currentSelectedIndex: number;
  projectConfig: { chain: ChainType };
  updateMetadata: (index: number, updates: any) => void;
  batchUpdateMetadata: (field: string, value: string) => void;
  regenerateMetadata: () => void;
}

export function useMetadataEditor({
  currentEntry,
  currentSelectedIndex,
  projectConfig,
  updateMetadata,
  batchUpdateMetadata,
  regenerateMetadata,
}: UseMetadataEditorProps) {
  const handleFieldChange = useCallback(
    (field: string, value: any) => {
      if (!currentEntry) return;

      const updatedMetadata = { ...currentEntry.metadata, [field]: value };
      updateMetadata(currentSelectedIndex, updatedMetadata);
    },
    [currentEntry, currentSelectedIndex, updateMetadata],
  );

  const handleAddAttribute = useCallback(() => {
    if (!currentEntry) return;

    const newAttribute =
      projectConfig.chain === "solana"
        ? { trait_type: "", value: "" }
        : { trait_type: "", value: "", display_type: undefined };

    const attributes = (currentEntry.metadata as any).attributes || [];
    handleFieldChange("attributes", [...attributes, newAttribute]);
  }, [currentEntry, projectConfig.chain, handleFieldChange]);

  const handleUpdateAttribute = useCallback(
    (index: number, field: string, value: any) => {
      if (!currentEntry) return;

      const attributes = [...((currentEntry.metadata as any).attributes || [])];
      attributes[index] = { ...attributes[index], [field]: value };
      handleFieldChange("attributes", attributes);
    },
    [currentEntry, handleFieldChange],
  );

  const handleRemoveAttribute = useCallback(
    (index: number) => {
      if (!currentEntry) return;

      const attributes = [...((currentEntry.metadata as any).attributes || [])];
      attributes.splice(index, 1);
      handleFieldChange("attributes", attributes);
    },
    [currentEntry, handleFieldChange],
  );

  const handleBatchUpdate = useCallback(
    (field: string, value: string) => {
      batchUpdateMetadata(field, value);
    },
    [batchUpdateMetadata],
  );

  const handleRegenerateAll = useCallback(() => {
    regenerateMetadata();
    toast.success("Metadata regenerated", {
      description: "All metadata has been reset to default values",
    });
  }, [regenerateMetadata]);

  return {
    handleFieldChange,
    handleAddAttribute,
    handleUpdateAttribute,
    handleRemoveAttribute,
    handleBatchUpdate,
    handleRegenerateAll,
  };
}
