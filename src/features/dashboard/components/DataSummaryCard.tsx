'use client';

import React from "react";
import { DataSummaryCardProps } from "../types";

const DataSummaryCard: React.FC<DataSummaryCardProps> = ({ icon, title, value }) => {
  return (
    <div className="flex items-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      {/* Icon Section */}
      <div className="p-3 mr-4 bg-orange-600 text-white rounded-full">
        {icon}
      </div>

      {/* Text Section */}
      <div>
        <h4 className="text-md font-medium text-stone-600">{title}</h4>
        <p className="text-xl font-semibold text-stone-800">{value}</p>
      </div>
    </div>
  );
};

export default DataSummaryCard;