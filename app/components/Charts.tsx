"use client"

import { useEffect, useRef, useState } from "react"
import * as echarts from "echarts"
import { useTheme } from "next-themes"

// 定義暗黑主題
const darkTheme = {
  color: [
    '#4338ca', '#6366f1', '#818cf8', '#93c5fd',
    '#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8'
  ],
  backgroundColor: 'transparent',
  textStyle: {
    color: '#ffffff'
  },
  title: {
    textStyle: {
      color: '#ffffff'
    }
  },
  line: {
    itemStyle: {
      borderWidth: 1
    },
    lineStyle: {
      width: 3
    },
    symbolSize: 6,
    symbol: 'circle',
    smooth: true
  },
  radar: {
    itemStyle: {
      borderWidth: 1
    },
    lineStyle: {
      width: 3
    },
    symbolSize: 6,
    symbol: 'circle',
    smooth: true
  },
  bar: {
    itemStyle: {
      barBorderWidth: 0,
      barBorderColor: '#cccccc'
    }
  },
  pie: {
    itemStyle: {
      borderWidth: 0,
      borderColor: '#cccccc'
    }
  },
  scatter: {
    itemStyle: {
      borderWidth: 0,
      borderColor: '#cccccc'
    }
  },
  boxplot: {
    itemStyle: {
      borderWidth: 0,
      borderColor: '#cccccc'
    }
  },
  parallel: {
    itemStyle: {
      borderWidth: 0,
      borderColor: '#cccccc'
    }
  },
  sankey: {
    itemStyle: {
      borderWidth: 0,
      borderColor: '#cccccc'
    }
  },
  funnel: {
    itemStyle: {
      borderWidth: 0,
      borderColor: '#cccccc'
    }
  },
  gauge: {
    itemStyle: {
      borderWidth: 0,
      borderColor: '#cccccc'
    }
  },
  candlestick: {
    itemStyle: {
      color: '#fc97af',
      color0: 'transparent',
      borderColor: '#fc97af',
      borderColor0: '#87f7cf',
      borderWidth: '2'
    }
  },
  graph: {
    itemStyle: {
      borderWidth: 0,
      borderColor: '#cccccc'
    },
    lineStyle: {
      width: 1,
      color: '#aaa'
    },
    symbolSize: 6,
    symbol: 'circle',
    smooth: true,
    color: [
      '#4338ca', '#6366f1', '#818cf8', '#93c5fd',
      '#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8'
    ],
    label: {
      color: '#ffffff'
    }
  },
  map: {
    itemStyle: {
      areaColor: '#eee',
      borderColor: '#444',
      borderWidth: 0.5
    },
    label: {
      color: '#000'
    },
    emphasis: {
      itemStyle: {
        areaColor: 'rgba(67,56,202,0.8)',
        borderColor: '#444',
        borderWidth: 1
      },
      label: {
        color: '#ffffff'
      }
    }
  },
  categoryAxis: {
    axisLine: {
      show: true,
      lineStyle: {
        color: 'rgba(255, 255, 255, 0.3)'
      }
    },
    axisTick: {
      show: true,
      lineStyle: {
        color: 'rgba(255, 255, 255, 0.3)'
      }
    },
    axisLabel: {
      show: true,
      color: '#ffffff'
    },
    splitLine: {
      show: false,
      lineStyle: {
        color: ['rgba(255, 255, 255, 0.1)']
      }
    },
    splitArea: {
      show: false
    }
  },
  valueAxis: {
    axisLine: {
      show: true,
      lineStyle: {
        color: 'rgba(255, 255, 255, 0.3)'
      }
    },
    axisTick: {
      show: true,
      lineStyle: {
        color: 'rgba(255, 255, 255, 0.3)'
      }
    },
    axisLabel: {
      show: true,
      color: '#ffffff'
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: ['rgba(255, 255, 255, 0.1)']
      }
    },
    splitArea: {
      show: false
    }
  },
  timeAxis: {
    axisLine: {
      show: true,
      lineStyle: {
        color: 'rgba(255, 255, 255, 0.3)'
      }
    },
    axisTick: {
      show: true,
      lineStyle: {
        color: 'rgba(255, 255, 255, 0.3)'
      }
    },
    axisLabel: {
      show: true,
      color: '#ffffff'
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: ['rgba(255, 255, 255, 0.1)']
      }
    },
    splitArea: {
      show: false
    }
  },
  toolbox: {
    iconStyle: {
      borderColor: '#999'
    },
    emphasis: {
      iconStyle: {
        borderColor: '#666'
      }
    }
  },
  legend: {
    textStyle: {
      color: '#ffffff'
    }
  },
  tooltip: {
    backgroundColor: 'rgba(30, 27, 75, 0.7)',
    borderColor: '#4338ca',
    textStyle: {
      color: '#ffffff'
    }
  }
};

// 定義光明主題
const lightTheme = {
  color: [
    '#17cfc8', '#15bab4', '#13a5a0', '#119089',
    '#0f7b75', '#0d6661', '#0b514d', '#093c39'
  ],
  backgroundColor: 'transparent',
  textStyle: {
    color: '#1f2937'
  },
  title: {
    textStyle: {
      color: '#1f2937'
    }
  },
  line: {
    itemStyle: {
      borderWidth: 1
    },
    lineStyle: {
      width: 3
    },
    symbolSize: 6,
    symbol: 'circle',
    smooth: true
  },
  radar: {
    itemStyle: {
      borderWidth: 1
    },
    lineStyle: {
      width: 3
    },
    symbolSize: 6,
    symbol: 'circle',
    smooth: true
  },
  bar: {
    itemStyle: {
      barBorderWidth: 0,
      barBorderColor: '#cccccc'
    }
  },
  pie: {
    itemStyle: {
      borderWidth: 0,
      borderColor: '#cccccc'
    }
  },
  scatter: {
    itemStyle: {
      borderWidth: 0,
      borderColor: '#cccccc'
    }
  },
  boxplot: {
    itemStyle: {
      borderWidth: 0,
      borderColor: '#cccccc'
    }
  },
  parallel: {
    itemStyle: {
      borderWidth: 0,
      borderColor: '#cccccc'
    }
  },
  sankey: {
    itemStyle: {
      borderWidth: 0,
      borderColor: '#cccccc'
    }
  },
  funnel: {
    itemStyle: {
      borderWidth: 0,
      borderColor: '#cccccc'
    }
  },
  gauge: {
    itemStyle: {
      borderWidth: 0,
      borderColor: '#cccccc'
    }
  },
  candlestick: {
    itemStyle: {
      color: '#fc97af',
      color0: 'transparent',
      borderColor: '#fc97af',
      borderColor0: '#87f7cf',
      borderWidth: '2'
    }
  },
  graph: {
    itemStyle: {
      borderWidth: 0,
      borderColor: '#cccccc'
    },
    lineStyle: {
      width: 1,
      color: '#aaa'
    },
    symbolSize: 6,
    symbol: 'circle',
    smooth: true,
    color: [
      '#17cfc8', '#15bab4', '#13a5a0', '#119089',
      '#0f7b75', '#0d6661', '#0b514d', '#093c39'
    ],
    label: {
      color: '#1f2937'
    }
  },
  map: {
    itemStyle: {
      areaColor: '#eee',
      borderColor: '#444',
      borderWidth: 0.5
    },
    label: {
      color: '#000'
    },
    emphasis: {
      itemStyle: {
        areaColor: 'rgba(23,207,200,0.8)',
        borderColor: '#444',
        borderWidth: 1
      },
      label: {
        color: '#1f2937'
      }
    }
  },
  categoryAxis: {
    axisLine: {
      show: true,
      lineStyle: {
        color: 'rgba(0, 0, 0, 0.25)'
      }
    },
    axisTick: {
      show: true,
      lineStyle: {
        color: 'rgba(0, 0, 0, 0.25)'
      }
    },
    axisLabel: {
      show: true,
      color: '#1f2937'
    },
    splitLine: {
      show: false,
      lineStyle: {
        color: ['rgba(0, 0, 0, 0.05)']
      }
    },
    splitArea: {
      show: false
    }
  },
  valueAxis: {
    axisLine: {
      show: true,
      lineStyle: {
        color: 'rgba(0, 0, 0, 0.25)'
      }
    },
    axisTick: {
      show: true,
      lineStyle: {
        color: 'rgba(0, 0, 0, 0.25)'
      }
    },
    axisLabel: {
      show: true,
      color: '#1f2937'
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: ['rgba(0, 0, 0, 0.05)']
      }
    },
    splitArea: {
      show: false
    }
  },
  timeAxis: {
    axisLine: {
      show: true,
      lineStyle: {
        color: 'rgba(0, 0, 0, 0.25)'
      }
    },
    axisTick: {
      show: true,
      lineStyle: {
        color: 'rgba(0, 0, 0, 0.25)'
      }
    },
    axisLabel: {
      show: true,
      color: '#1f2937'
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: ['rgba(0, 0, 0, 0.05)']
      }
    },
    splitArea: {
      show: false
    }
  },
  toolbox: {
    iconStyle: {
      borderColor: '#999'
    },
    emphasis: {
      iconStyle: {
        borderColor: '#666'
      }
    }
  },
  legend: {
    textStyle: {
      color: '#1f2937'
    }
  },
  tooltip: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderColor: '#17cfc8',
    textStyle: {
      color: '#1f2937'
    }
  }
};

// 註冊主題
echarts.registerTheme('darkTheme', darkTheme);
echarts.registerTheme('lightTheme', lightTheme);

interface ChartData {
  name: string
  value: number
}

interface LineChartProps {
  data: ChartData[]
  height?: number
  title?: string
}

// 共用的主題偵測和切換邏輯
function useThemeDetection() {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const checkDarkMode = () => {
      // 優先使用 next-themes 的 resolvedTheme
      if (resolvedTheme) {
        setDarkMode(resolvedTheme === 'dark');
        return;
      }

      // 備選方案：檢查系統主題和 HTML 的 class
      setDarkMode(
        window.matchMedia('(prefers-color-scheme: dark)').matches ||
        document.documentElement.classList.contains('dark')
      );
    };

    checkDarkMode();

    // 監聽系統主題變更
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => checkDarkMode();
    mediaQuery.addEventListener('change', handleChange);

    // 監聽手動切換主題
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          checkDarkMode();
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
      observer.disconnect();
    };
  }, [resolvedTheme]);

  return darkMode;
}

export function LineChart({ data, height = 300, title }: LineChartProps) {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<echarts.ECharts | null>(null)
  const darkMode = useThemeDetection();

  // 當主題變更時重新繪製圖表
  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.dispose();
      chartInstance.current = null;
    }
  }, [darkMode]);

  useEffect(() => {
    if (!chartRef.current) return

    // 初始化圖表，套用主題
    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current, darkMode ? 'darkTheme' : 'lightTheme')
    }

    // 配置圖表選項
    const option: echarts.EChartsOption = {
      title: title
        ? {
            text: title,
            left: 'center',
          }
        : undefined,
      tooltip: {
        trigger: 'axis',
        formatter: '{b}: {c}',
      },
      xAxis: {
        type: 'category',
        data: data.map(item => item.name),
        axisLabel: {
          rotate: data.length > 12 ? 45 : 0,
          fontSize: 11,
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          fontSize: 11,
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: title ? '40' : '10',
        containLabel: true
      },
      series: [
        {
          data: data.map(item => item.value),
          type: 'line',
          smooth: true,
          symbolSize: 6,
          lineStyle: {
            width: 3
          },
          areaStyle: {
            opacity: 0.2
          }
        }
      ]
    }

    // 設置圖表
    chartInstance.current.setOption(option)

    // 處理視窗大小變化
    const handleResize = () => {
      chartInstance.current?.resize()
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      chartInstance.current?.dispose()
      chartInstance.current = null
    }
  }, [data, title, darkMode])

  return (
    <div ref={chartRef} style={{ width: '100%', height: `${height}px` }}></div>
  )
}

export function DoughnutChart({ data, height = 300, title }: LineChartProps) {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<echarts.ECharts | null>(null)
  const darkMode = useThemeDetection();

  // 當主題變更時重新繪製圖表
  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.dispose();
      chartInstance.current = null;
    }
  }, [darkMode]);

  useEffect(() => {
    if (!chartRef.current) return

    // 初始化圖表
    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current, darkMode ? 'darkTheme' : 'lightTheme')
    }

    // 配置圖表選項
    const option: echarts.EChartsOption = {
      title: title
        ? {
            text: title,
            left: 'center',
          }
        : undefined,
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)',
      },
      legend: {
        orient: 'horizontal',
        bottom: 0,
        left: 'center',
        itemWidth: 12,
        itemHeight: 12,
      },
      series: [
        {
          name: title || '數據',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: true,
          itemStyle: {
            borderRadius: 4,
            borderColor: darkMode ? '#1e1b4b' : '#ffffff',
            borderWidth: 2
          },
          label: {
            show: false,
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 12,
              fontWeight: 'bold',
            }
          },
          labelLine: {
            show: false
          },
          data: data.map(item => ({
            name: item.name,
            value: item.value
          }))
        }
      ]
    }

    // 設置圖表
    chartInstance.current.setOption(option)

    // 處理視窗大小變化
    const handleResize = () => {
      chartInstance.current?.resize()
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      chartInstance.current?.dispose()
      chartInstance.current = null
    }
  }, [data, title, darkMode])

  return (
    <div ref={chartRef} style={{ width: '100%', height: `${height}px` }}></div>
  )
}

export function PieChart({ data, height = 300, title }: LineChartProps) {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<echarts.ECharts | null>(null)
  const darkMode = useThemeDetection();

  // 當主題變更時重新繪製圖表
  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.dispose();
      chartInstance.current = null;
    }
  }, [darkMode]);

  useEffect(() => {
    if (!chartRef.current) return

    // 初始化圖表
    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current, darkMode ? 'darkTheme' : 'lightTheme')
    }

    // 配置圖表選項
    const option: echarts.EChartsOption = {
      title: title
        ? {
            text: title,
            left: 'center',
          }
        : undefined,
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)',
      },
      legend: {
        orient: 'horizontal',
        bottom: 0,
        left: 'center',
        itemWidth: 12,
        itemHeight: 12,
      },
      series: [
        {
          name: title || '數據',
          type: 'pie',
          radius: '70%',
          avoidLabelOverlap: true,
          itemStyle: {
            borderRadius: 4,
            borderColor: darkMode ? '#1e1b4b' : '#ffffff',
            borderWidth: 2
          },
          label: {
            show: false,
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 12,
              fontWeight: 'bold',
            }
          },
          labelLine: {
            show: false
          },
          data: data.map(item => ({
            name: item.name,
            value: item.value
          }))
        }
      ]
    }

    // 設置圖表
    chartInstance.current.setOption(option)

    // 處理視窗大小變化
    const handleResize = () => {
      chartInstance.current?.resize()
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      chartInstance.current?.dispose()
      chartInstance.current = null
    }
  }, [data, title, darkMode])

  return (
    <div ref={chartRef} style={{ width: '100%', height: `${height}px` }}></div>
  )
}

export function BarChart({ data, height = 300, title }: LineChartProps) {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<echarts.ECharts | null>(null)
  const darkMode = useThemeDetection();

  // 當主題變更時重新繪製圖表
  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.dispose();
      chartInstance.current = null;
    }
  }, [darkMode]);

  useEffect(() => {
    if (!chartRef.current) return

    // 初始化圖表
    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current, darkMode ? 'darkTheme' : 'lightTheme')
    }

    // 配置圖表選項
    const option: echarts.EChartsOption = {
      title: title
        ? {
            text: title,
            left: 'center',
          }
        : undefined,
      tooltip: {
        trigger: 'axis',
        formatter: '{b}: {c}',
      },
      xAxis: {
        type: 'category',
        data: data.map(item => item.name),
        axisLabel: {
          rotate: data.length > 5 ? 45 : 0,
          fontSize: 11,
          interval: 0,
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          fontSize: 11,
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '14%',
        top: title ? '40' : '10',
        containLabel: true
      },
      series: [
        {
          data: data.map(item => item.value),
          type: 'bar',
          barWidth: '60%',
          itemStyle: {
            borderRadius: [4, 4, 0, 0],
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: darkMode ? '#4338ca' : '#17cfc8' },
              { offset: 1, color: darkMode ? '#312e81' : '#15bab4' }
            ])
          },
          label: {
            show: false,
            position: 'top',
            formatter: '{c}',
            fontSize: 12,
          },
          emphasis: {
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: darkMode ? '#4c46e5' : '#13a5a0' },
                { offset: 1, color: darkMode ? '#4338ca' : '#119089' }
              ])
            }
          }
        }
      ]
    }

    // 設置圖表
    chartInstance.current.setOption(option)

    // 處理視窗大小變化
    const handleResize = () => {
      chartInstance.current?.resize()
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      chartInstance.current?.dispose()
      chartInstance.current = null
    }
  }, [data, title, darkMode])

  return (
    <div ref={chartRef} style={{ width: '100%', height: `${height}px` }}></div>
  )
}
