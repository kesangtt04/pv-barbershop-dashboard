/* eslint-disable perfectionist/sort-imports */
import type { CardProps } from '@mui/material/Card';
import type { ChartOptions } from 'src/components/chart';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import { useTheme, alpha as hexAlpha } from '@mui/material/styles';

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { useRef } from 'react';

import { Chart, useChart } from 'src/components/chart';

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

export function AnalyticsWebsiteVisits({ title, subheader, chart, sx, ...other }: Props) {
  const theme = useTheme();
  const chartRef = useRef<HTMLDivElement>(null);

  const chartColors = chart.colors ?? [
    hexAlpha(theme.palette.primary.dark, 0.8),
    hexAlpha(theme.palette.warning.main, 0.8),
  ];

  const chartOptions = useChart({
    colors: chartColors,
    stroke: { width: 2, colors: ['transparent'] },
    xaxis: { categories: chart.categories },
    legend: { show: true },
    tooltip: { y: { formatter: (value: number) => `${value}` } },
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
            height: 364,
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
