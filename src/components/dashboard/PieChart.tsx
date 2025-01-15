'use client'

import React from 'react'
import ReactECharts from 'echarts-for-react'

type PieChartProps = {
    title: string
    data: { value: number, name: string }[]
}

export default function CustomPieChart({
    title,
    data,
}: PieChartProps) {
    const options = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          left: 'center'
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: true,
              formatter: '{b}: {d}%',
              position: 'outside'
            },
            emphasis: {
              label: {
                show: false,
                fontSize: 16,
                fontWeight: 'bold',
                formatter: '{b}: {d}%'
              }
            },
            labelLine: {
              show: true
            },
            data: data
          }
        ]
      };

    return (
        <div className="bg-white p-8 py-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            <ReactECharts option={options} />
        </div>
    )
}