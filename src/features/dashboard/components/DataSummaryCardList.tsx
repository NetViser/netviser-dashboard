"use client";

import { useMemo } from "react";
import DataSummaryCard from "./DataSummaryCard";
import { FaTable } from "react-icons/fa";
import { SiDowndetector } from "react-icons/si";
import { TbCategoryFilled } from "react-icons/tb";
import { DataSummaryCardListProps } from "../types/index.types";

const DataSummaryCardList: React.FC<DataSummaryCardListProps> = ({ data }) => {
  const summaryCards = useMemo(
    () => [
      {
        title: "Total Rows",
        value: data?.total_rows ?? "N/A",
        icon: <FaTable size={32} />,
      },
      {
        title: "Total Detected Attacks",
        value: data?.total_detected_attacks ?? "N/A",
        icon: <SiDowndetector size={32} />,
      },
      {
        title: "Detected Attack Types",
        value: Object.keys(data?.detected_attacks_distribution || {}).length ?? "N/A",
        icon: <TbCategoryFilled size={32} />,
      },
    ],
    [data]
  );

  return (
    <div className="flex flex-row items-start gap-x-6" id="summary-cards">
      {summaryCards.map((card, index) => (
        <DataSummaryCard
          key={index}
          title={card.title}
          value={card.value}
          icon={card.icon}
        />
      ))}
    </div>
  );
};

export default DataSummaryCardList;
