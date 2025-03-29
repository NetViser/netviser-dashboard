import { FetchSpecificAttackResponse } from "@/lib/api/fetchAttackDetectionOverview";

export type SpecificAttackVisualizationSectionProps = {
  data: FetchSpecificAttackResponse | undefined;
};

export type AttackDetectionTimeSeriesProps = {
    attackType: string;
};