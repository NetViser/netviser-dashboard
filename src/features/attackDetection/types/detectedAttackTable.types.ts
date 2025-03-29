export interface AttackData {
    attackType: string;
    numberOfAttacks: number;
    isSelected?: boolean;
  }
  
export interface AttacksTableProps {
    data: AttackData[];
    onAnalyze: (attackType: string) => void;
}
  