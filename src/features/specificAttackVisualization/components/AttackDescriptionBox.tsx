"use client";

import React from "react";
import { AttackDescriptionBoxProps } from "../types";

const AttackDescriptionBox: React.FC<AttackDescriptionBoxProps> = ({
  attackType,
  description,
}) => {
  return (
    <div
      className="w-full p-6 bg-white border-l-4 border-orange-500 rounded-xl shadow-sm"
      id="attack-description"
    >
      <div className="flex flex-col">
        <h1 className="text-xl font-bold text-stone-900 mb-2">{`${attackType} Description`}</h1>
        <p className="text-stone-800 text-base leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};

export default AttackDescriptionBox;
