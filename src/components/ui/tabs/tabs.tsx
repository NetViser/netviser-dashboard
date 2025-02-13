"use client"

import React, { ReactNode } from "react";

interface TabProps {
  tab: string;
  label: string;
  children: ReactNode;
}

export const Tab: React.FC<TabProps> = ({ tab, label, children }) => {
  return <div>{children}</div>;
};

interface TabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  children: ReactNode;
}

export const Tabs: React.FC<TabsProps> = ({ activeTab, setActiveTab, children }) => {
  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div>
      {/* Tab Buttons */}
      <div className="flex gap-4">
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            const { tab, label } = (child as React.ReactElement<TabProps>).props;
            return (
              <button
                onClick={() => handleTabClick(tab)}
                className={`px-6 py-2 rounded-lg shadow-md transition-all duration-300 ease-in-out transform 
                  ${activeTab === tab 
                    ? "bg-orange-500 text-white shadow-lg scale-105 font-semibold"
                    : "bg-white text-orange-500 border border-gray-300 shadow-sm hover:bg-orange-100"} 
                  hover:shadow-md hover:scale-105 
                  focus:ring-2 focus:ring-orange-400 focus:outline-none active:scale-95`}
              >
                {label}
              </button>
            );
          }
          return null;
        })}
      </div>

      {/* Tab Content */}
      <div className="shadow border-[0.2rem] border-orange-300 font-light p-8 rounded text-gray-500 bg-stone-100/30 mt-4">
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            const { tab, children } = (child as React.ReactElement<TabProps>).props;
            return activeTab === tab ? <div>{children}</div> : null;
          }
          return null;
        })}
      </div>
    </div>
  );
};
