"use client";

import React from "react";
import ReactECharts from "echarts-for-react";

type DDOSScatterProps = {
    title: string;
    normalData: number[][];
    attackData: number[][];
}

export default function DdosScatterChart({
    title,
    normalData,
    attackData
  }: DDOSScatterProps) {

        const options = {
            title: {
            text: {title},
            subtext: 'Data from: Heinz 2003'
            },
            grid: {
            left: '3%',
            right: '7%',
            bottom: '7%',
            containLabel: true
            },
            tooltip: {
            // trigger: 'axis',
            showDelay: 0,
            axisPointer: {
                show: true,
                type: 'cross',
                lineStyle: {
                type: 'dashed',
                width: 1
                }
            }
            },
            toolbox: {
            feature: {
                dataZoom: {},
                brush: {
                type: ['rect', 'polygon', 'clear']
                }
            }
            },
            brush: {},
            legend: {
            data: ['Female', 'Male'],
            left: 'center',
            bottom: 10
            },
            xAxis: [
            {
                type: 'value',
                scale: true,
                axisLabel: {
                formatter: '{value} cm'
                },
                splitLine: {
                show: false
                }
            }
            ],
            yAxis: [
            {
                type: 'value',
                scale: true,
                axisLabel: {
                formatter: '{value} kg'
                },
                splitLine: {
                show: false
                }
            }
            ],
            series: [
            {
                name: 'Normal',
                type: 'scatter',
                emphasis: {
                focus: 'series'
                },
                // prettier-ignore
                data: normalData,
            },
            {
                name: 'Attack',
                type: 'scatter',
                emphasis: {
                focus: 'series'
                },
                // prettier-ignore
                data: attackData,
            }
            ]
        };

        return (
            <div className="bg-white p-8 py-4 rounded-lg shadow-md w-full h-full">
              <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
              <ReactECharts option={options} style={{ height: 400 }} />
            </div>
          );

    }
  
  