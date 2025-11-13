"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";

interface BatchEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemCount: number;
  onApply: (field: string, value: string) => void;
}

export function BatchEditDialog({
  open,
  onOpenChange,
  itemCount,
  onApply,
}: BatchEditDialogProps) {
  const [batchField, setBatchField] = useState<string>("");
  const [batchValue, setBatchValue] = useState<string>("");

  const handleApply = () => {
    if (!batchField || !batchValue) {
      toast.error("Missing information", {
        description: "Please select a field and enter a value",
      });
      return;
    }

    onApply(batchField, batchValue);
    onOpenChange(false);
    setBatchField("");
    setBatchValue("");

    toast.success("Batch update complete", {
      description: `Updated ${batchField} for all ${itemCount} items`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Batch Edit</DialogTitle>
          <DialogDescription>
            Apply the same value to a field across all {itemCount} items
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="batch-field">Field</Label>
            <Input
              id="batch-field"
              value={batchField}
              onChange={(e) => setBatchField(e.target.value)}
              placeholder="e.g., external_url"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="batch-value">Value</Label>
            <Input
              id="batch-value"
              value={batchValue}
              onChange={(e) => setBatchValue(e.target.value)}
              placeholder="Enter value to apply"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleApply}>Apply to All</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
