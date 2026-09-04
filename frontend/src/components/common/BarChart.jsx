import { ApexChart } from './ApexChart';

/**
 * Bar chart generik. `series` dan `options` sudah dimapping di helpers.
 * @param {{ series: unknown[], options: object, height?: number }} props
 */
export function BarChart({ series, options, height = 280 }) {
  return <ApexChart type="bar" series={series} options={options} height={height} />;
}
