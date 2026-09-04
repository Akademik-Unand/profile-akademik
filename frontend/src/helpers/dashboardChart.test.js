import { summarizeUnits, unitStatusChart, unitTemplateChart } from './dashboardChart';

const units = [
  { id: 1, name: 'Akademik', isActive: true, isDefault: true, templateKey: 'classic' },
  { id: 2, name: 'Perpustakaan', isActive: true, isDefault: false, templateKey: 'classic' },
  { id: 3, name: 'UPT PDK', isActive: false, isDefault: false, templateKey: 'modern' },
];

describe('dashboardChart', () => {
  it('summarizes unit counts', () => {
    expect(summarizeUnits(units)).toEqual({ total: 3, active: 2, inactive: 1, defaults: 1 });
  });

  it('maps status donut series', () => {
    const chart = unitStatusChart(units, 'admin');
    expect(chart.series).toEqual([2, 1]);
    expect(chart.options.labels).toEqual(['Aktif', 'Nonaktif']);
  });

  it('groups units by template', () => {
    const chart = unitTemplateChart(units, 'admin');
    expect(chart.options.xaxis.categories).toEqual(['classic', 'modern']);
    expect(chart.series[0].data).toEqual([2, 1]);
  });
});
