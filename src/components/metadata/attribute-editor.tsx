"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { MetadataAttribute, SolanaAttribute } from "@/lib/types";
import { Plus, Trash2 } from "lucide-react";
import { memo } from "react";

interface AttributeEditorProps {
  attributes: (MetadataAttribute | SolanaAttribute)[];
  chain: string;
  onAdd: () => void;
  onUpdate: (index: number, field: string, value: any) => void;
  onRemove: (index: number) => void;
}

export const AttributeEditor = memo(
  ({ attributes, chain, onAdd, onUpdate, onRemove }: AttributeEditorProps) => {
    return (
      <>
        {attributes && attributes.length > 0 ? (
          <div className="space-y-3" role="list" aria-label="Attributes">
            {attributes.map((attr, idx) => (
              <div
                key={idx}
                className="flex gap-2 items-start p-3 border rounded-md"
                role="listitem"
              >
                <div className="flex-1 space-y-2">
                  <Input
                    value={attr.trait_type}
                    onChange={(e) =>
                      onUpdate(idx, "trait_type", e.target.value)
                    }
                    placeholder="Trait type"
                    aria-label={`Attribute ${idx + 1} trait type`}
                  />
                  <Input
                    value={attr.value}
                    onChange={(e) => onUpdate(idx, "value", e.target.value)}
                    placeholder="Value"
                    aria-label={`Attribute ${idx + 1} value`}
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemove(idx)}
                  aria-label={`Remove attribute ${idx + 1}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            No attributes added yet
          </p>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={onAdd}
          className="w-full bg-transparent"
        >
          <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
          Add Attribute
        </Button>
      </>
    );
  },
);

AttributeEditor.displayName = "AttributeEditor";
