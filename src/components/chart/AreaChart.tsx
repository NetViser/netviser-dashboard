'use client'

import React from 'react'
import ReactECharts from 'echarts-for-react'
import * as echarts from 'echarts';

type AreaChartData = {
    name: string
    data: number[]
    colorStart?: string // Optional start color
    colorEnd: string    // Mandatory end color
}

type AreaChartProps = {
    title: string
    dates: string[]
    datasets: AreaChartData[]
    chartOption?: {
        yAxisLabel?: string
    }
}

export default function AreaChart({
    title,
    dates,
    datasets,
    chartOption,
}: AreaChartProps) {
    const series = datasets.map(dataset => ({
        name: dataset.name,
        type: 'line',
        symbol: 'none',
        sampling: 'lttb',
        itemStyle: {
            color: dataset.colorEnd
        },
        areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                ...(dataset.colorStart ? [{ offset: 0, color: dataset.colorStart }] : []), // Include only if colorStart exists
                { offset: 1, color: dataset.colorEnd }
            ])
        },
        data: dataset.data
    }));

    const options = {
        tooltip: {
            trigger: 'axis',
            position: function (pt: number[]) {
                return [pt[0], '10%'];
            }
        },
        title: {
            left: 'center',
            text: title
        },
        legend: {
            top: '10%', // Adjust the position of the legend
            left: 'center', // Align the legend to the center
        },
        toolbox: {
            feature: {
                restore: {},
                saveAsImage: {}
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: dates
        },
        yAxis: {
            type: 'value',
            boundaryGap: [0, '100%'],
            max: 'dataMax',
            name: chartOption?.yAxisLabel || ''
        },
        dataZoom: [
            {
                type: 'inside',
                start: 20,
                end: 80,
            },
            {
                start: 20,
                end: 80,
            }
        ],
        series: series
    };

    return (
        <div className="bg-white p-8 py-4 rounded-lg shadow-md">
            <ReactECharts style={
                { height: '360px', width: '100%' }
            } option={options} />
        </div>
    )
}
