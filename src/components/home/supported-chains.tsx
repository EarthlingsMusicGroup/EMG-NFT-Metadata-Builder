import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getChainIconUrl, supportedChains } from "@/lib/chain-info";
import type { ChainType } from "@/lib/types";
import Image from "next/image";

export function SupportedChains() {
  return (
    <Card className="mb-12 border-dashed">
      <CardHeader>
        <CardTitle className="text-lg">Supported Blockchains</CardTitle>
        <CardDescription>
          Generate metadata compatible with major NFT marketplaces
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {supportedChains.map((chain) => (
            <Badge key={chain.name} variant="outline" className="gap-1.5">
              <Image
                src={getChainIconUrl(chain.id as ChainType)}
                alt={chain.name}
                width={16}
                height={16}
                className="rounded"
                unoptimized
              />
              <span>{chain.name}</span>
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
