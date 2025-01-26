'use client';

import React, { ReactElement } from 'react';

type SummaryCardProps = {
  icon: ReactElement; // Now accepts a React element
  title: string;
  value: string | number;
};

const SummaryCard: React.FC<SummaryCardProps> = ({ icon, title, value }) => {
  return (
    <div className="flex items-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      {/* Icon Section */}
      <div className="p-3 mr-4 bg-blue-100 text-blue-500 rounded-full">
        {icon}
      </div>

      {/* Text Section */}
      <div>
        <h4 className="text-md font-medium text-gray-500">{title}</h4>
        <p className="text-xl font-semibold text-gray-800">{value}</p>
      </div>
    </div>
  );
};

export default SummaryCard;
