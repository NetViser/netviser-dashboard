"use client";

import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

type VisDescriptionAccordionProps = {
  title: string;
  description: string;
};

export function VisDescriptionAccordion({
  title,
  description,
}: VisDescriptionAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-orange-100/50 rounded-md border border-orange-300">
      <button
        className="w-full flex justify-between items-center p-3 text-md font-semibold text-black focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
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