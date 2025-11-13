import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

export function HowItWorks() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5" />
          How It Works
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm">
              1
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold mb-1">Create a Project</h4>
              <p className="text-sm text-muted-foreground">
                Choose your blockchain (Ethereum, Solana, Polygon, XRP, or
                Tezos) and set up your collection details.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm">
              2
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold mb-1">Upload Images</h4>
              <p className="text-sm text-muted-foreground">
                Drag and drop your NFT images. They're stored locally in your
                browser using IndexedDB.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm">
              3
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold mb-1">Edit Metadata</h4>
              <p className="text-sm text-muted-foreground">
                Customize names, descriptions, and attributes for each NFT. Use
                batch edit to update multiple items at once.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm">
              4
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold mb-1">Export & Deploy</h4>
              <p className="text-sm text-muted-foreground">
                Export as JSON files, ZIP archives, or upload directly to IPFS.
                All metadata follows blockchain-specific standards.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
