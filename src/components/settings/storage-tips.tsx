"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Lightbulb } from "lucide-react";

const tips = [
  {
    title: "Optimize File Sizes",
    description:
      "Compress images and videos before uploading to save space and improve performance.",
  },
  {
    title: "Regular Cleanup",
    description:
      "Delete unused projects and files regularly to maintain optimal storage usage.",
  },
  {
    title: "Export Important Data",
    description:
      "Export your projects regularly to avoid data loss and keep backups.",
  },
];

export function StorageTips() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          Storage Tips
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tips.map((tip, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className="shrink-0 mt-0.5">
                <CheckCircle2 className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm mb-1">{tip.title}</div>
                <div className="text-sm text-muted-foreground leading-relaxed">
                  {tip.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
