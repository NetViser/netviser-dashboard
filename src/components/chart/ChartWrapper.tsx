"use client";

interface ChartWrapperProps {
  height: string; // Accept string for flexible units like '400px' or '10rem'
  children: React.ReactNode;
}

export const ChartWrapper: React.FC<ChartWrapperProps> = ({
  height,
  children,
}) => {
  return <div className={`h-[${height}]`}>{children}</div>;
};
