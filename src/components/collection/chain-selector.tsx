"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getChainIconUrl } from "@/lib/chain-info";
import { useProjectStore } from "@/lib/project-store";
import { CHAIN_SCHEMAS } from "@/lib/schemas";
import type { ChainType } from "@/lib/types";
import { ChevronRight } from "lucide-react";
import Image from "next/image";

export function ChainSelector() {
  const { projects, currentProjectId, updateProject } = useProjectStore();

  const project = projects.find((p) => p.id === currentProjectId);
  const projectConfig = project?.projectConfig || {
    chain: "ethereum" as any,
    collectionName: "",
    collectionDescription: "",
    externalUrl: "",
    creatorAddress: "",
    royaltyPercentage: 5,
    symbol: "NFT",
    storageType: "local",
  };
  const currentStep = project?.currentStep || 0;

  const setProjectConfig = (config: any) => {
    if (project) {
      updateProject(project.id, {
        projectConfig: { ...projectConfig, ...config },
      });
    }
  };

  const setCurrentStep = (step: number) => {
    if (project) {
      updateProject(project.id, { currentStep: step });
    }
  };

  const handleChainChange = (chain: ChainType) => {
    setProjectConfig({ chain });
  };

  const handleContinue = () => {
    setCurrentStep(Math.max(currentStep, 1));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>1. Select Blockchain & Configure Project</CardTitle>
        <CardDescription>
          Choose your target blockchain and set collection-wide settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label>Blockchain Standard</Label>
          <RadioGroup
            value={projectConfig.chain}
            onValueChange={(value) => handleChainChange(value as ChainType)}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3"
          >
            {Object.values(CHAIN_SCHEMAS).map((schema) => (
              <label
                key={schema.id}
                className="relative flex cursor-pointer rounded-lg border border-border bg-card p-4 hover:bg-accent transition-colors"
              >
                <RadioGroupItem value={schema.id} className="sr-only" />
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Image
                      src={getChainIconUrl(schema.id)}
                      alt={schema.name}
                      width={24}
                      height={24}
                      className="rounded"
                      unoptimized
                    />
                    <span className="font-semibold">{schema.name}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {schema.description}
                  </p>
                </div>
                {projectConfig.chain === schema.id && (
                  <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary" />
                )}
              </label>
            ))}
          </RadioGroup>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="collection-name">Collection Name</Label>
            <Input
              id="collection-name"
              value={projectConfig.collectionName}
              onChange={(e) =>
                setProjectConfig({ collectionName: e.target.value })
              }
              placeholder="My NFT Collection"
            />
          </div>

          {projectConfig.chain === "solana" && (
            <div className="space-y-2">
              <Label htmlFor="symbol">Symbol</Label>
              <Input
                id="symbol"
                value={projectConfig.symbol}
                onChange={(e) => setProjectConfig({ symbol: e.target.value })}
                placeholder="NFT"
                maxLength={10}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="creator-address">Creator Address (Optional)</Label>
            <Input
              id="creator-address"
              value={projectConfig.creatorAddress}
              onChange={(e) =>
                setProjectConfig({ creatorAddress: e.target.value })
              }
              placeholder="0x..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="royalty">Royalty Percentage</Label>
            <Input
              id="royalty"
              type="number"
              min="0"
              max="100"
              value={projectConfig.royaltyPercentage}
              onChange={(e) =>
                setProjectConfig({ royaltyPercentage: Number(e.target.value) })
              }
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Collection Description</Label>
          <Textarea
            id="description"
            value={projectConfig.collectionDescription}
            onChange={(e) =>
              setProjectConfig({ collectionDescription: e.target.value })
            }
            placeholder="Describe your NFT collection..."
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="external-url">External URL (Optional)</Label>
          <Input
            id="external-url"
            type="url"
            value={projectConfig.externalUrl}
            onChange={(e) => setProjectConfig({ externalUrl: e.target.value })}
            placeholder="https://..."
          />
        </div>

        <Button onClick={handleContinue} className="w-full sm:w-auto">
          Continue to Upload
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
