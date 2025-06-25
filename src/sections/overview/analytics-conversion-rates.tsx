/* eslint-disable perfectionist/sort-imports */
import type { CardProps } from '@mui/material/Card';
import type { ChartOptions } from 'src/components/chart';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import { useTheme, alpha as hexAlpha } from '@mui/material/styles';

import { fNumber } from 'src/utils/format-number';

import { Chart, useChart } from 'src/components/chart';

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { useRef } from 'react';

// ----------------------------------------------------------------------

type Props = CardProps & {
  title?: string;
  subheader?: string;
  chart: {
    colors?: string[];
    categories?: string[];
    series: {
      name: string;
      data: number[];
    }[];
    options?: ChartOptions;
  };
};

export function AnalyticsConversionRates({ title, subheader, chart, sx, ...other }: Props) {
  const theme = useTheme();
  const chartRef = useRef<HTMLDivElement>(null);

  const chartColors = chart.colors ?? [
    theme.palette.primary.dark,
    hexAlpha(theme.palette.primary.dark, 0.24),
  ];

  const chartOptions = useChart({
    colors: chartColors,
    stroke: { width: 2, colors: ['transparent'] },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (value: number) => fNumber(value),
        title: { formatter: (seriesName: string) => `${seriesName}: ` },
      },
    },
    xaxis: { categories: chart.categories },
    dataLabels: {
      enabled: true,
      offsetX: -6,
      style: { fontSize: '10px', colors: ['#FFFFFF', theme.palette.text.primary] },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 2,
        barHeight: '48%',
        dataLabels: { position: 'top' },
      },
    },
    ...chart.options,
  });

  const handleExportPDF = async () => {
    if (!chartRef.current) return;

    const canvas = await html2canvas(chartRef.current);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('landscape');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, 'PNG', 0, 10, pdfWidth, pdfHeight);
    pdf.save(`${title || 'chart'}.pdf`);
  };

  return (
    <Card ref={chartRef} sx={sx} {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Box>
        <Chart
          type="bar"
          series={chart.series}
          options={chartOptions}
          slotProps={{ loading: { p: 2.5 } }}
          sx={{
            pl: 1,
            py: 2.5,
            pr: 2.5,
            height: 360,
          }}
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
