"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getChainIconUrl, getChainInfo } from "@/lib/chain-info";
import { CHAIN_SCHEMAS } from "@/lib/schemas";
import type { ChainType } from "@/lib/types";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import { memo } from "react";

interface ChainInfoCardProps {
  chain: ChainType;
}

export const ChainInfoCard = memo(({ chain }: ChainInfoCardProps) => {
  const schema = CHAIN_SCHEMAS[chain];
  const chainInfo = getChainInfo(chain);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Image
            src={getChainIconUrl(chain)}
            alt={chainInfo.title}
            width={32}
            height={32}
            className="rounded"
            unoptimized
          />
          <div>
            <CardTitle className="text-xl">{chainInfo.title}</CardTitle>
            <CardDescription>{chainInfo.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold mb-2">Features</h4>
            <div className="flex flex-wrap gap-2">
              {chainInfo.features.map((feature, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Resources</h4>
            <div className="space-y-1">
              {chainInfo.links.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  <ExternalLink className="h-3 w-3" />
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

ChainInfoCard.displayName = "ChainInfoCard";
