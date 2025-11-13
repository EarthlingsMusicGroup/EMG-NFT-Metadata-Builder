"use client";

import { MetadataRow } from "@/components/metadata/metadata-row";
import { memo } from "react";
import type { RowComponentProps } from "react-window";
import { List } from "react-window";

interface MetadataListProps {
  metadataEntries: any[];
  images: any[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

type RowProps = {
  metadataEntries: any[];
  images: any[];
  selectedIndex: number;
  onSelect: (index: number) => void;
};

const RowComponent = memo(
  ({
    index,
    style,
    metadataEntries,
    images,
    selectedIndex,
    onSelect,
  }: RowComponentProps<RowProps>) => {
    const entry = metadataEntries[index];
    if (!entry) return null;

    const image = images.find((img: any) => img.id === entry?.imageId);
    return (
      <MetadataRow
        index={index}
        style={style}
        entry={entry}
        image={image}
        isSelected={selectedIndex === index}
        onSelect={onSelect}
      />
    );
  },
);

RowComponent.displayName = "RowComponent";

export const MetadataList = memo(
  ({ metadataEntries, images, selectedIndex, onSelect }: MetadataListProps) => {
    if (!metadataEntries || metadataEntries.length === 0) {
      return (
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-muted/50 px-4 py-2 border-b">
            <p className="text-sm font-medium">All Items</p>
          </div>
          <div className="p-8 text-center text-muted-foreground">
            <p>No metadata entries</p>
          </div>
        </div>
      );
    }

    return (
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-muted/50 px-4 py-2 border-b">
          <p className="text-sm font-medium">All Items</p>
          <p className="text-xs text-muted-foreground">
            Use ↑↓ arrow keys to navigate
          </p>
        </div>
        <List<RowProps>
          rowComponent={RowComponent}
          rowCount={metadataEntries.length}
          rowHeight={80}
          rowProps={{
            metadataEntries,
            images,
            selectedIndex,
            onSelect,
          }}
          style={{ height: 600, width: "100%" }}
        />
      </div>
    );
  },
);

MetadataList.displayName = "MetadataList";
