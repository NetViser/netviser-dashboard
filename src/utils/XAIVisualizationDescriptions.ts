// Define the type for each visualization description
type VisDescription = {
  title: string;
  description: string;
};

// Define the type for the entire object, specifying the allowed keys
type XaiVisDescriptions = {
  feature_importance: VisDescription;
  bee_swarm: VisDescription;
};

// Export the constant with the type
export const XAI_VIS_DESCRIPTIONS: XaiVisDescriptions = {
  feature_importance: {
    title: "What is SHAP Feature Importance Plot?",
    description:
      "This bar chart shows the average impact each feature has on whether the model classifies it as an attack. The height of each bar represents its average absolute SHAP value of that feature across all instances. A higher bar means that feature has a greater influence on the model's classification. Use this to quickly identify which features are most critical in its decision-making process.",
  },
  bee_swarm: {
    title: "What is SHAP Beeswarm Plot?",
    description:
      "This plot shows how each feature affects each individual instance’s outcome. Each row represents a feature, and each dot represents one instance. The position of each dot indicates the feature's impact on that instance's classification, with positive values meaning it pushed towards 'attack', and negative values meaning away from 'attack'. Use this to explore how features affect individual data points and identify variability and outliers.",
  },
};
