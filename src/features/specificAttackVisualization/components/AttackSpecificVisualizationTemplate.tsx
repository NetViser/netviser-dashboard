import React from "react";
import DescriptionAccordion from "@/components/accordion/DescriptionAccordion";
import { AttackVisTemplateProps } from "../types";


export default function AttackSpecificVisualizationTemplate({
  blocks,
}: AttackVisTemplateProps) {
  // Ensure exactly 4 blocks are provided for the 2x2 grid
  if (blocks.length !== 4) {
    console.warn("AttackVisTemplate expects exactly 4 blocks for a 2x2 grid.");
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {blocks.map((block, index) => (
        <div
          key={index}
          className="bg-white rounded-lg border-2 shadow-sm flex flex-col"
        >
          {/* Render the component */}
          {block.component}

          {/* Render the description accordion if both title and description are provided */}
          {block.accordionTitle && block.description && (
            <div className="p-4 border-t border-gray-200">
              <DescriptionAccordion
                title={block.accordionTitle}
                description={block.description}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
