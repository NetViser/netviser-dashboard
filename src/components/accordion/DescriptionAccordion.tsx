"use client";

import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

type DescriptionAccordionProps = {
  title: string;
  description: string;
};

export default function DescriptionAccordion({
  title,
  description,
}: DescriptionAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  const customIdMap: Record<string, string> = {
    "What is SHAP Feature Importance Plot?": "description-bar",
    "What is SHAP Beeswarm Plot?": "description-beeswarm",
  };

  // Assign ID based on mapping, or use title with underscores
  const elementId = customIdMap[title];

  return (
    <div className="bg-orange-100/50 rounded-md border border-orange-300" id={`${elementId}`}>
      <button
        className="w-full flex justify-between items-center p-3 text-md font-semibold text-black focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
        id={`vis-description-${title}`}
      >
        <span>{title}</span>
        {isOpen ? (
          <FaChevronUp className="text-red-900" />
        ) : (
          <FaChevronDown className="text-red-900" />
        )}
      </button>
      {isOpen && (
        <div className="p-3 pt-0">
          <p className="text-md text-red-900">{description}</p>
        </div>
      )}
    </div>
  );
}