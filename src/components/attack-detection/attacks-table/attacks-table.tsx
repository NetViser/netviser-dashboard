"use client";

import React from "react";
import { TbZoomCheck } from "react-icons/tb";
import clsx from "clsx";

interface AttackData {
  attackType: string;
  numberOfAttacks: number;
  isSelected?: boolean;
}

interface AttacksTableProps {
  data: AttackData[];
  onAnalyze: (attackType: string) => void;
}

const AttacksTable: React.FC<AttacksTableProps> = ({ data, onAnalyze }) => {
  return (
    <div className="py-8 px-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl shadow-xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Detected Attack Types</h2>
        <p className="mt-2 text-sm text-gray-600">
          Browse the detected attack types and their frequencies to understand potential threats.
        </p>
      </div>
      <div className="overflow-x-auto border rounded-xl">
        <table className="min-w-full bg-white divide-y divide-gray-200 shadow-lg rounded-xl">
          <thead className="bg-orange-600">
            <tr>
              <th className="px-8 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                Attack Type
              </th>
              <th className="px-8 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                Number of Attacks
              </th>
              <th className="px-8 py-4 text-center text-sm font-semibold text-white uppercase tracking-wider">
                <span className="sr-only">Analyze</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {data.map((rowData, index) => {
              const isLastRow = index === data.length - 1;
              return (
                <tr
                  key={index}
                  className={clsx(
                    "transition duration-300 ease-in-out",
                    {
                      "bg-yellow-100": rowData.isSelected,
                      "hover:bg-gray-50": !rowData.isSelected,
                      "hover:bg-yellow-50": rowData.isSelected,
                    }
                  )}
                >
                  <td className="px-8 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                    {rowData.attackType}
                  </td>
                  <td className="px-8 py-4 whitespace-nowrap text-sm text-gray-600">
                    {rowData.numberOfAttacks}
                  </td>
                  <td className="px-8 py-4 whitespace-nowrap text-center">
                    <button
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm bg-gradient-to-r from-orange-400 to-orange-500 text-white hover:from-orange-500 hover:to-orange-600 transition duration-300"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAnalyze(rowData.attackType);
                      }}
                    >
                      <span className="mr-2">Analyze</span>
                      <TbZoomCheck size={20} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttacksTable;
