export interface Block {
  component: React.ReactElement; // The component to render in the block
  accordionTitle?: string; // Optional title for the description accordion
  description?: string; // Optional description text for the accordion
}

// Define the props for the template component
export type AttackVisTemplateProps = {
  blocks: Block[]; // Array of 4 blocks for the 2x2 grid
};