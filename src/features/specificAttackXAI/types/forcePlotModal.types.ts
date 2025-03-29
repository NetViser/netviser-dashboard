export interface ForcePlotModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  attackType: string;
  selectedRow: number;
}
