import { getChartColors, isDarkAdminTheme } from '../constants/theme';

const CHART_FONT_FAMILY = "'DM Sans', system-ui, sans-serif";

function isActiveUnit(unit) {
  return Boolean(unit?.isActive);
}

export function summarizeUnits(units = []) {
  const total = units.length;
  const active = units.filter(isActiveUnit).length;
  return {
    total,
    active,
    inactive: total - active,
    defaults: units.filter((unit) => Boolean(unit?.isDefault)).length,
  };
}

export function unitStatusChart(units = [], theme) {
  const { active, inactive } = summarizeUnits(units);
  const colors = getChartColors(theme);
  const dark = isDarkAdminTheme(theme);

  return {
    series: [active, inactive],
    options: {
      chart: {
        type: 'donut',
        fontFamily: CHART_FONT_FAMILY,
        foreColor: dark ? '#cbd5e1' : '#64748b',
        toolbar: { show: false },
      },
      labels: ['Aktif', 'Nonaktif'],
      colors: [colors.success, colors.muted],
      legend: { position: 'bottom', fontSize: '12px' },
      dataLabels: { enabled: true },
      stroke: { width: 0 },
      plotOptions: {
        pie: {
          donut: {
            size: '62%',
            labels: {
              show: true,
              total: { show: true, label: 'Unit', fontSize: '12px' },
            },
          },
        },
      },
      tooltip: { theme: dark ? 'dark' : 'light' },
    },
  };
}

export function unitTemplateChart(units = [], theme) {
  const counts = new Map();
  units.forEach((unit) => {
    const key = unit.templateKey || 'Tanpa template';
    counts.set(key, (counts.get(key) || 0) + 1);
  });
  const categories = [...counts.keys()];
  const data = categories.map((key) => counts.get(key));
  const colors = getChartColors(theme);
  const dark = isDarkAdminTheme(theme);

  return {
    series: [{ name: 'Unit', data }],
    options: {
      chart: {
        type: 'bar',
        fontFamily: CHART_FONT_FAMILY,
        foreColor: dark ? '#cbd5e1' : '#64748b',
        toolbar: { show: false },
        redrawOnParentResize: true,
      },
      plotOptions: {
        bar: {
          columnWidth: '42%',
          borderRadius: 2,
          borderRadiusApplication: 'end',
        },
      },
      colors: [colors.primary],
      dataLabels: { enabled: false },
      xaxis: {
        categories,
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: {
        min: 0,
        forceNiceScale: true,
        labels: { formatter: (value) => `${Math.round(value)}` },
      },
      grid: { strokeDashArray: 4, borderColor: dark ? '#334155' : '#e5e7eb' },
      legend: { show: false },
      tooltip: { theme: dark ? 'dark' : 'light' },
    },
  };
}
