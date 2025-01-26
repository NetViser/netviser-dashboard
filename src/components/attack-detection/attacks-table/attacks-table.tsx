"use client";

import React from "react";
import { TbZoomCheck } from "react-icons/tb";
import clsx from "clsx";

interface AttackData {
  attackType: string;
  numberOfAttacks: number;
  description: string;
  onAttackTypeClick: (attackType: string) => void;
  isSelected: boolean;
}

interface AttacksTableProps {
  data: AttackData[];
  onAnalyze: (attackType: string) => void;
}

const AttacksTable: React.FC<AttacksTableProps> = ({ data, onAnalyze }) => {
  return (
    <div className="py-6 bg-white rounded-lg px-6 shadow-md">
      <div className="pb-4 text-xl font-semibold text-left text-gray-900">
        Detected Attack Types
        <p className="mt-1 text-md font-normal text-gray-500">
          Browse the detected attack types, their frequency, and descriptions to
          understand potential threats better.
        </p>
      </div>
      <div className="relative overflow-x-auto border bg-white rounded-lg">
        <table className="w-full text-md text-left text-gray-500">
          <thead className="text-white uppercase bg-gray-900 rounded-lg">
            <tr>
              <th scope="col" className="px-6 py-3">Attack Type</th>
              <th scope="col" className="px-6 py-3">Number of Attacks</th>
              <th scope="col" className="px-6 py-3">Description</th>
              <th scope="col" className="px-6 py-3">
                <span className="sr-only">Analyze</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((rowData, index) => {
              const isLastRow = index === data.length - 1;

              return (
                <tr
                  key={index}
                  className={clsx(
                    "cursor-pointer transition-colors",
                    {
                      "bg-orange-200": rowData.isSelected,
                      "bg-white": !rowData.isSelected,
                      "border-b": !isLastRow,
                      "hover:bg-gray-200": !rowData.isSelected,
                      "hover:bg-orange-50": rowData.isSelected,
                    }
                  )}
                  onClick={() => rowData.onAttackTypeClick(rowData.attackType)}
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                  >
                    {rowData.attackType}
                  </th>
                  <td className="px-6 py-4">{rowData.numberOfAttacks}</td>
                  <td className="px-6 py-4">{rowData.description}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      className="flex items-center px-4 py-2 bg-orange-500 text-white font-semibold text-sm rounded-md hover:bg-orange-600 transition"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering the row click
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
