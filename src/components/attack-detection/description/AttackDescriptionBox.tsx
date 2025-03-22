"use client";

import React from "react";

interface AttackDescriptionBoxProps {
  attack: {
    attackType: string;
    description: string;
  };
}

const AttackDescriptionBox: React.FC<AttackDescriptionBoxProps> = ({ attack }) => {
  return (
    <div className="w-full p-6 bg-white border-l-4 border-orange-500 rounded-xl shadow-sm">
      <div className="flex flex-col">
        <h1 className="text-xl font-bold text-stone-900 mb-2">Description</h1>
        <p className="text-stone-800 text-base leading-relaxed">
          {attack.description}
        </p>
      </div>
    </div>
  );
};

export default AttackDescriptionBox;
