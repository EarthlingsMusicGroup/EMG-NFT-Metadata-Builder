"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getChainIconUrl } from "@/lib/chain-info";
import { useProjectStore } from "@/lib/project-store";
import { CHAIN_SCHEMAS } from "@/lib/schemas";
import type { ChainType } from "@/lib/types";
import { Plus } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface CreateProjectDialogProps {
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export function CreateProjectDialog({
  trigger,
  onSuccess,
}: CreateProjectDialogProps) {
  const router = useRouter();
  const { createProject, updateProject } = useProjectStore();
  const [open, setOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectChain, setProjectChain] = useState<ChainType>("ethereum");

  const handleCreateProject = () => {
    if (!projectName.trim()) {
      toast.error("Project name is required");
      return;
    }

    const projectId = createProject(
      projectName.trim(),
      projectDescription.trim() || undefined,
    );

    updateProject(projectId, {
      projectConfig: {
        chain: projectChain,
        collectionName: projectName.trim(),
        collectionDescription:
          projectDescription.trim() || "A unique NFT collection",
        externalUrl: "",
        creatorAddress: "",
        royaltyPercentage: 5,
        symbol: "NFT",
        storageType: "local",
      },
    });

    setProjectName("");
    setProjectDescription("");
    setProjectChain("ethereum");
    setOpen(false);
    router.push(`/p/${projectId}`);
    toast.success("Project created successfully");
    onSuccess?.();
  };

  const defaultTrigger = (
    <Button className="gap-2">
      <Plus className="h-4 w-4" />
      Create Project
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Create a new NFT metadata project. You can always modify these
            settings later.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Project Name</Label>
            <Input
              id="name"
              placeholder="My NFT Collection"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="A unique NFT collection..."
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="chain">Blockchain</Label>
            <Select
              value={projectChain}
              onValueChange={(value: ChainType) => setProjectChain(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a blockchain" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(CHAIN_SCHEMAS).map((schema) => (
                  <SelectItem key={schema.id} value={schema.id}>
                    <span className="flex items-center gap-2">
                      <Image
                        src={getChainIconUrl(schema.id)}
                        alt={schema.name}
                        width={20}
                        height={20}
                        className="rounded"
                        unoptimized
                      />
                      <span>{schema.name}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreateProject}>Create Project</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
