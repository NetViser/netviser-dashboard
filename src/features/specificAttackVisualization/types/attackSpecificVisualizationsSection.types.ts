export type AttackSpecificVisualizationsSectionProps = {
  attackType: string;
  activeTab: "overall" | "timeseries";
  setActiveTab: (tab: "overall" | "timeseries") => void;
};
