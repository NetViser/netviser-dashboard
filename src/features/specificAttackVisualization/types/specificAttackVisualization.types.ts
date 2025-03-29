import { FetchSpecificAttackResponse } from "@/lib/api/types";

export type SpecificAttackVisualizationSectionProps = {
  data: FetchSpecificAttackResponse | undefined;
};

export type AttackDetectionTimeSeriesProps = {
    attackType: string;
};