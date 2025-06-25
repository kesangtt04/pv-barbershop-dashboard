/* eslint-disable perfectionist/sort-imports */
import type { CardProps } from '@mui/material/Card';
import type { ChartOptions } from 'src/components/chart';

import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import { useTheme } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';

import { fNumber } from 'src/utils/format-number';

import { Chart, useChart, ChartLegends } from 'src/components/chart';

import { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';

// ----------------------------------------------------------------------

type Props = CardProps & {
  title?: string;
  subheader?: string;
  chart: {
    colors?: string[];
    series: {
      label: string;
      value: number;
    }[];
    options?: ChartOptions;
  };
};

export function AnalyticsCurrentVisits({ title, subheader, chart, sx, ...other }: Props) {
  const theme = useTheme();
  const chartRef = useRef<HTMLDivElement>(null);

  const chartSeries = chart.series.map((item) => item.value);

  const chartColors = chart.colors ?? [
    theme.palette.primary.main,
    theme.palette.warning.light,
    theme.palette.info.dark,
    theme.palette.error.main,
  ];

  const chartOptions = useChart({
    chart: { sparkline: { enabled: true } },
    colors: chartColors,
    labels: chart.series.map((item) => item.label),
    stroke: { width: 0 },
    dataLabels: { enabled: true, dropShadow: { enabled: false } },
    tooltip: {
      y: {
        formatter: (value: number) => fNumber(value),
        title: { formatter: (seriesName: string) => `${seriesName}` },
      },
    },
    plotOptions: { pie: { donut: { labels: { show: false } } } },
    ...chart.options,
  });

  const handleExportPDF = async () => {
    if (!chartRef.current) return;

    const canvas = await html2canvas(chartRef.current);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('portrait');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, 'PNG', 0, 10, pdfWidth, pdfHeight);
    pdf.save(`${title || 'pie-chart'}.pdf`);
  };

  return (
    <Card ref={chartRef} sx={sx} {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Box>
        <Chart
          type="pie"
          series={chartSeries}
          options={chartOptions}
          sx={{
            my: 6,
            mx: 'auto',
            width: { xs: 240, xl: 260 },
            height: { xs: 240, xl: 260 },
          }}
        />

        <Divider sx={{ borderStyle: 'dashed' }} />

        <ChartLegends
          labels={chartOptions?.labels}
          colors={chartOptions?.colors}
          sx={{ p: 3, justifyContent: 'center' }}
        />
      </Box>

      <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 2 }}>
        <Button variant="outlined" onClick={handleExportPDF}>
          Export PDF
        </Button>
      </CardActions>
    </Card>
  );
}
