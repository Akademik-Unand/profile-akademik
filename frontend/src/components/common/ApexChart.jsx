import { lazy, Suspense } from 'react';

const Chart = lazy(() => import('react-apexcharts'));

/**
 * Wrapper ApexCharts. `series`/`options` sudah dimapping di helpers.
 * @param {{ type: string, series: unknown, options: object, height?: number }} props
 */
export function ApexChart({ type, series, options, height = 280 }) {
  return (
    <Suspense fallback={<div className="skeleton h-72 w-full" />}>
      <Chart type={type} series={series} options={options} height={height} width="100%" />
    </Suspense>
  );
}
