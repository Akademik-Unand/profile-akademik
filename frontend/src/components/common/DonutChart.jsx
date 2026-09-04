import { ApexChart } from './ApexChart';

/**
 * Donut chart generik. `series` dan `options` sudah dimapping di helpers.
 * @param {{ series: number[], options: object, height?: number }} props
 */
export function DonutChart({ series, options, height = 280 }) {
  return <ApexChart type="donut" series={series} options={options} height={height} />;
}
