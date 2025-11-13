import { Card, CardContent } from "@/components/ui/card";
import { FileJson, Image, Shield, Zap } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "100% Local & Private",
    description:
      "All data stays in your browser. No servers, no tracking, complete privacy.",
  },
  {
    icon: Image,
    title: "Drag & Drop Images",
    description:
      "Upload JPG, PNG, GIF, or WebP. Images are stored locally in your browser.",
  },
  {
    icon: FileJson,
    title: "Export & Import",
    description:
      "Export projects as JSON or ZIP. Import anytime to continue working.",
  },
  {
    icon: Zap,
    title: "Batch Operations",
    description:
      "Edit metadata across multiple NFTs at once. Save time with bulk updates.",
  },
];

export function FeaturesGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {features.map((feature, index) => {
        const Icon = feature.icon;
        return (
          <Card key={index}>
            <CardContent>
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-muted">
                  <Icon className="h-5 w-5 text-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
