import * as echarts from 'echarts';
import ReactECharts from "echarts-for-react";
import { useEffect, useMemo, useState, useRef } from 'react';

type EChartsOption = echarts.EChartsOption;

interface FtpScatterProps {
    normalData: number[];
    attackData: number[];
}

function calculateAverage(data: number[]) {
  let total = 0;
  for (var i = 0; i < data.length; i++) {
    total += data[i];
  }
  return (total /= data.length);
}

const FTPChart = ({ normalData, attackData }: FtpScatterProps) => {
    const [chartType, setChartType] = useState<'scatter' | 'bar'>('scatter');

    const scatterOption = useMemo<EChartsOption>(() => ({
        animationDuration: 2000,
        animationEasing: 'cubicInOut',
        xAxis: { 
            type: 'value',
            scale: true,
            name: 'Flow Packets/s'
        },
        yAxis: {
            type: 'value',
            scale: true,
            name: 'Average Packet Size'
        },
        series: [
            {
                type: 'scatter',
                id: 'normal',
                dataGroupId: 'normal',
                universalTransition: {
                    enabled: true,
                    seriesKey: ['normal', 'attack'],
                    divideShape: 'clone'
                },
                data: normalData,
                symbolSize: 12,
                itemStyle: {
                    color: '#5470C6'
                }
            },
            {
                type: 'scatter',
                id: 'attack',
                dataGroupId: 'attack',
                universalTransition: {
                    enabled: true,
                    seriesKey: ['normal', 'attack'],
                    divideShape: 'clone'
                },
                data: attackData,
                symbolSize: 12,
                itemStyle: {
                    color: '#EE6666'
                }
            }
        ]
    }), [normalData, attackData]);

    const barOption = useMemo<EChartsOption>(() => ({
        animationDuration: 1000,
        animationEasing: 'cubicInOut',
        xAxis: {
            type: 'category',
            data: ['Normal Traffic', 'Attack Traffic'],
            name: 'Traffic Type'
        },
        yAxis: {
            type: 'value',
            name: 'Average Flow Packets/s'
        },
        series: [
            {
                type: 'bar',
                id: 'normal',
                dataGroupId: 'normal',
                universalTransition: {
                    enabled: true,
                    seriesKey: ['normal', 'attack'],
                    divideShape: 'clone'
                },
                data: [
                    {
                        value: calculateAverage(normalData),
                        groupId: 'normal',
                        itemStyle: { color: '#5470C6' }
                    },
                    {
                        value: calculateAverage(attackData),
                        groupId: 'attack',
                        itemStyle: { color: '#EE6666' }
                    }
                ],
            },
        ]
    }), [normalData, attackData]);

    useEffect(() => {
        const interval = setInterval(() => {
            setChartType(prev => prev === 'scatter' ? 'bar' : 'scatter');
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{ width: '100%', height: '500px', margin: '20px 0' }}>
            <ReactECharts 
                option={chartType === 'scatter' ? scatterOption : barOption}
                style={{ height: '100%', width: '100%' }}
                opts={{
                    renderer: 'svg',
                    locale: 'EN',
                    height: 500,
                    width: 'auto'
                }}
                notMerge={false}
                lazyUpdate={true}
            />
        </div>
    );
}

export default FTPChart;