"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { memo } from "react";

interface PreviewJsonTabProps {
  metadata: any;
}

export const PreviewJsonTab = memo(({ metadata }: PreviewJsonTabProps) => {
  return (
    <div className="mt-4">
      <ScrollArea className="h-[400px] w-full rounded-md border">
        <pre className="p-4 text-xs">
          <code>{JSON.stringify(metadata, null, 2)}</code>
        </pre>
      </ScrollArea>
    </div>
  );
});

PreviewJsonTab.displayName = "PreviewJsonTab";
