"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface XAIModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedRow: number;
}

/**
 * XAIModal is a reusable dialog component for displaying
 * Explainable AI (XAI) details such as SHAP visuals.
 */
export function XAIModal({
  open,
  onOpenChange,
  selectedRow,
}: XAIModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        {/* DialogHeader can hold the title & description */}
        <DialogHeader>
          <DialogTitle>{`Specific Attack XAI Visualization`}</DialogTitle>
        </DialogHeader>

        {/* Body of the modal, e.g. your XAI chart */}
        <div className="py-2">{selectedRow}</div>

        {/* Footer with a close button (optional) */}
        <DialogFooter>
          {/* You can also use DialogClose directly or your own button */}
          <Button variant="outline"  onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
