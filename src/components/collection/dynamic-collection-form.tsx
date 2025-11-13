"use client";

import { AdvancedSettings } from "@/components/collection/advanced-settings";
import { ChainConfigFields } from "@/components/collection/chain-config-fields";
import { ChainInfoCard } from "@/components/collection/chain-info-card";
import { CollectionFormFields } from "@/components/collection/collection-form-fields";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CHAIN_SCHEMAS } from "@/lib/schemas";
import type { Project } from "@/lib/types";
import { Wallet } from "lucide-react";
import { useState } from "react";

interface DynamicCollectionFormProps {
  project: Project;
  onUpdate: (updates: Partial<Project>) => void;
}

export function DynamicCollectionForm({
  project,
  onUpdate,
}: DynamicCollectionFormProps) {
  const chain = project.projectConfig.chain;
  const schema = CHAIN_SCHEMAS[chain];
  const [showAdvanced, setShowAdvanced] = useState(false);

  const updateProjectConfig = (updates: Partial<Project["projectConfig"]>) => {
    onUpdate({
      projectConfig: {
        ...project.projectConfig,
        ...updates,
      },
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <ChainInfoCard chain={chain} />

      <Card>
        <CardHeader>
          <CardTitle>Collection Configuration</CardTitle>
          <CardDescription>
            Configure your NFT collection details for {schema.name}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <CollectionFormFields
            chain={chain}
            projectConfig={project.projectConfig}
            onUpdate={updateProjectConfig}
          />

          <Separator />

          <div className="space-y-4">
            <h4 className="font-semibold flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              {schema.name} Specific Settings
            </h4>
            <ChainConfigFields
              chain={chain}
              projectConfig={project.projectConfig}
              onUpdate={updateProjectConfig}
            />
          </div>

          <Separator />

          <div className="space-y-4">
            <Button
              variant="outline"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full"
            >
              {showAdvanced ? "Hide" : "Show"} Advanced Settings
            </Button>

            {showAdvanced && (
              <AdvancedSettings
                projectConfig={project.projectConfig}
                onUpdate={updateProjectConfig}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
