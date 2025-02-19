"use client";

interface ChartWrapperProps {
  height: string; // Accept string for flexible units like '400px' or '10rem'
  width?: string; // Accept string for flexible units like '100%' or '500px'
  children: React.ReactNode;
}

export const ChartWrapper: React.FC<ChartWrapperProps> = ({
  height,
  width = "100%",
  children,
}) => {
  return <div className={`h-[${height}] w-[${width}]`}>{children}</div>;
};
