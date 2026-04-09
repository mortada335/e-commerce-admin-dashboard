// Importing utility function hexToRgb from '@layouts/utils'

// import { hexToRgb } from '@layouts/utils';

// Function to generate color variables based on theme colors
const colorVariables = themeColors => {
  // Calculating theme secondary text color with opacity
  // const themeSecondaryTextColor = `rgba(${hexToRgb(themeColors.colors['on-surface'])},${themeColors.variables['medium-emphasis-opacity']})`;
  // // Calculating theme disabled text color with opacity
  // const themeDisabledTextColor = `rgba(${hexToRgb(themeColors.colors['on-surface'])},${themeColors.variables['disabled-opacity']})`;
  // // Calculating theme border color with opacity
  // const themeBorderColor = `rgba(${hexToRgb(String(themeColors.variables['border-color']))},${themeColors.variables['border-opacity']})`;

  // Returning an object containing different color variables
  return { labelColor: 'themeDisabledTextColor', borderColor: 'themeBorderColor', legendColor: 'themeSecondaryTextColor' };
};

// Functions to get configurations for different types of charts follow a similar pattern
// with the color variables obtained using the colorVariables function and returning
// configuration objects specific to each chart type.
// Other functions provided are getLineChartConfig, getRadarChartConfig, getPolarChartConfig,
// getBubbleChartConfig, getDoughnutChartConfig, getPieChartConfig, getScatterChartConfig,
// and getLineAreaChartConfig.

// SECTION config
// 👉 Latest Bar Chart Config
export const getBarChartConfig = () => {
  // const { borderColor, labelColor } = colorVariables(themeColors)

  return {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 500 },
    scales: {
      x: {
        grid: {
          borderColor:'#2F2B3D',
          drawBorder: false,
          color: '#2F2B3D',
        },
        ticks: { color: '#2F2B3D' },
      },
      y: {
        min: 0,
        max: 400,
        grid: {
          borderColor:'#2F2B3D',
          drawBorder: false,
          color: '#2F2B3D',
        },
        ticks: {
          stepSize: 100,
          color: '#2F2B3D',
        },
      },
    },
    plugins: {
      legend: { display: false },
    },
  }
}

// 👉 Horizontal Bar Chart Config
export const getHorizontalBarChartConfig = themeColors => {
  const { borderColor, labelColor, legendColor } = colorVariables(themeColors)

  return {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 500 },
    elements: {
      bar: {
        borderRadius: {
          topRight: 15,
          bottomRight: 15,
        },
      },
    },
    layout: {
      padding: { top: -4 },
    },
    scales: {
      x: {
        min: 0,
        grid: {
          drawTicks: false,
          drawBorder: false,
          color: borderColor,
        },
        ticks: { color: labelColor },
      },
      y: {
        grid: {
          borderColor,
          display: false,
          drawBorder: false,
        },
        ticks: { color: labelColor },
      },
    },
    plugins: {
      legend: {
        align: 'end',
        position: 'top',
        labels: { color: legendColor },
      },
    },
  }
}

// 👉 Line Chart Config
export const getLineChartConfig = () => {
  // const { borderColor, labelColor, legendColor } = colorVariables(themeColors)

  return {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: { color: '#2F2B3D' },
        grid: {
          borderColor:'#2F2B3D',
          drawBorder: false,
          color: '#2F2B3D',
        },
      },
      y: {
        min: 0,
        max: 400,
        ticks: {
          stepSize: 100,
          color: '#2F2B3D',
        },
        grid: {
          borderColor:'#2F2B3D',
          drawBorder: false,
          color: '#2F2B3D',
        },
      },
    },
    plugins: {
      legend: {
        align: 'end',
        position: 'top',
        labels: {
          padding: 25,
          boxWidth: 10,
          color: '#2F2B3D',
          usePointStyle: true,
        },
      },
    },
  }
}

// 👉 Radar Chart Config
export const getRadarChartConfig = themeColors => {
  const { borderColor, labelColor, legendColor } = colorVariables(themeColors)

  return {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 500 },
    layout: {
      padding: { top: -20 },
    },
    scales: {
      r: {
        ticks: {
          display: false,
          maxTicksLimit: 1,
          color: labelColor,
        },
        grid: { color: borderColor },
        pointLabels: { color: labelColor },
        angleLines: { color: borderColor },
      },
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          padding: 25,
          color: legendColor,
        },
      },
    },
  }
}

// 👉 Polar Chart Config
export const getPolarChartConfig = themeColors => {
  const { legendColor } = colorVariables(themeColors)

  return {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 500 },
    layout: {
      padding: {
        top: -5,
        bottom: -45,
      },
    },
    scales: {
      r: {
        grid: { display: false },
        ticks: { display: false },
      },
    },
    plugins: {
      legend: {
        position: 'right',
        labels: {
          padding: 25,
          boxWidth: 9,
          color: legendColor,
          usePointStyle: true,
        },
      },
    },
  }
}

// 👉 Bubble Chart Config
export const getBubbleChartConfig = themeColors => {
  const { borderColor, labelColor } = colorVariables(themeColors)

  return {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        min: 0,
        max: 140,
        grid: {
          borderColor,
          drawBorder: false,
          color: borderColor,
        },
        ticks: {
          stepSize: 10,
          color: labelColor,
        },
      },
      y: {
        min: 0,
        max: 400,
        grid: {
          borderColor,
          drawBorder: false,
          color: borderColor,
        },
        ticks: {
          stepSize: 100,
          color: labelColor,
        },
      },
    },
    plugins: {
      legend: { display: false },
    },
  }
}

// 👉 Doughnut Chart Config
export const getDoughnutChartConfig = () => {
  // const { legendColor } = colorVariables(themeColors)
  return {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 500 },
    cutout: 80,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          padding: 25,
          boxWidth: 9,
          color: '#2F2B3D',
          usePointStyle: true,
        },
      },
    },
  }
}
// 👉 Pin Chart Config
export const getPieChartConfig = () => {
  // const { legendColor } = colorVariables(themeColors)
  return {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 500 },
    cutout: 0,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          padding: 25,
          boxWidth: 9,
          color: '#2F2B3D',
          usePointStyle: true,
        },
      },
    },
  }
}

// 👉 Scatter Chart Config
export const getScatterChartConfig = themeColors => {
  const { borderColor, labelColor, legendColor } = colorVariables(themeColors)

  return {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 800 },
    layout: {
      padding: { top: -20 },
    },
    scales: {
      x: {
        min: 0,
        max: 140,
        grid: {
          borderColor,
          drawTicks: false,
          drawBorder: false,
          color: borderColor,
        },
        ticks: {
          stepSize: 10,
          color: labelColor,
        },
      },
      y: {
        min: 0,
        max: 400,
        grid: {
          borderColor,
          drawTicks: false,
          drawBorder: false,
          color: borderColor,
        },
        ticks: {
          stepSize: 100,
          color: labelColor,
        },
      },
    },
    plugins: {
      legend: {
        align: 'start',
        position: 'top',
        labels: {
          padding: 25,
          boxWidth: 9,
          color: legendColor,
          usePointStyle: true,
        },
      },
    },
  }
}

// 👉 Line Area Chart Config
export const getLineAreaChartConfig = themeColors => {
  const { borderColor, labelColor, legendColor } = colorVariables(themeColors)

  return {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: { top: -20 },
    },
    scales: {
      x: {
        grid: {
          borderColor,
          color: 'transparent',
        },
        ticks: { color: labelColor },
      },
      y: {
        min: 0,
        max: 400,
        grid: {
          borderColor,
          color: 'transparent',
        },
        ticks: {
          stepSize: 100,
          color: labelColor,
        },
      },
    },
    plugins: {
      legend: {
        align: 'start',
        position: 'top',
        labels: {
          padding: 25,
          boxWidth: 9,
          color: legendColor,
          usePointStyle: true,
        },
      },
    },
  }
}

