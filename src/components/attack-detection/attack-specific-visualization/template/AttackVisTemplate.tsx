import React from 'react';
import { VisDescriptionAccordion } from '../accordion/VisDescriptionAccordion';

// Define the interface for each block
interface Block {
  component: React.ReactElement; // The component to render in the block
  accordionTitle?: string;       // Optional title for the description accordion
  description?: string;          // Optional description text for the accordion
}

// Define the props for the template component
type AttackVisTemplateProps = {
  blocks: Block[]; // Array of 4 blocks for the 2x2 grid
};

/**
 * A reusable template component that renders a 2x2 grid (2 rows, 2 columns)
 * where each block can contain any component and an optional description accordion.
 */
export function AttackVisTemplate({ blocks }: AttackVisTemplateProps) {
  // Ensure exactly 4 blocks are provided for the 2x2 grid
  if (blocks.length !== 4) {
    console.warn('AttackVisTemplate expects exactly 4 blocks for a 2x2 grid.');
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
              <VisDescriptionAccordion
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