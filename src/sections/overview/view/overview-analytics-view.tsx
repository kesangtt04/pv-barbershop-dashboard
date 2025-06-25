/* eslint-disable perfectionist/sort-imports */
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';
import { AnalyticsCurrentVisits } from '../analytics-current-visits';
import { AnalyticsWebsiteVisits } from '../analytics-website-visits';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';
import { AnalyticsConversionRates } from '../analytics-conversion-rates';
import { useEffect, useState } from 'react';
import {
  findAllBarber,
  getAllReviews,
  getAppointmentInYear,
  getIncomeOfBarbersInMonth,
  getIncomeOfSystemInYear,
  getRatingsOfBarber,
} from 'src/redux/apiRequest';
import { useDispatch } from 'react-redux';
import { Button, MenuItem, TextField } from '@mui/material';

// ----------------------------------------------------------------------

export function OverviewAnalyticsView() {
  const [barberIncome, setBarberIncome] = useState([]);
  const [ratingData, setRatingData] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [systemRangeAppointment, setSystemRangeAppointment] = useState<any[]>([]);
  const [systemRangeIncome, setSystemRangeIncome] = useState<number[]>([]);
  const [monthIncome, setMonthIncome] = useState(0);
  const [monthAppointment, setMonthAppointment] = useState(0);
  const [monthReview, setMonthReview] = useState(0);
  const [monthBarber, setMonthBarber] = useState(0);

  const fetchBarberIncome = async () => {
    const res = await getIncomeOfBarbersInMonth(dispatch);
    if (res?.metadata) setBarberIncome(res.metadata);
  };

  const dispatch = useDispatch();
  const [yearIncome, setYearIncome] = useState<number[]>([]);

  const fetchData = async () => {
    const currentYear = new Date().getFullYear();
    const data = await getIncomeOfSystemInYear(currentYear, dispatch);
    if (data?.metadata) {
      const incomeData = data.metadata.map((item: any) => item.totalIncome);
      setYearIncome(incomeData);
    }
  };

  const fetchRatings = async () => {
    const res = await getRatingsOfBarber(dispatch);
    if (res?.metadata) setRatingData(res.metadata);
  };

  const topBarber = barberIncome.reduce(
    (prev: any, curr: any) => (curr.totalIncome > prev.totalIncome ? curr : prev),
    { totalIncome: 0 }
  );

  const handleFetchChartData = async () => {
    const systemRes = await getIncomeOfSystemInYear(year, dispatch);

    if (systemRes?.metadata) {
      const income = systemRes.metadata.map((item: any) => item.totalIncome);
      setSystemRangeIncome(income);

      const totalIncome = income.reduce((sum: any, val: any) => sum + val, 0);
      setMonthIncome(totalIncome);
    }

    const appointmentRes = await getAppointmentInYear(year, dispatch);

    if (appointmentRes?.metadata) {
      const appointmentCounts = appointmentRes.metadata.map((item: any) => item.count);
      setSystemRangeAppointment(appointmentCounts);

      const totalAppointments = appointmentCounts.reduce((sum: any, val: any) => sum + val, 0);
      setMonthAppointment(totalAppointments);
    }

    const reviews = await getAllReviews(dispatch);
    setMonthReview(reviews?.length);

    const barbers = await findAllBarber(dispatch);
    setMonthBarber(barbers?.metadata.length);
  };

  useEffect(() => {
    fetchData();
    fetchBarberIncome();
    fetchRatings();
    handleFetchChartData();
  }, []);
  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        Hi, Welcome back 👋
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="Income"
            total={monthIncome}
            icon={<img alt="Income" src="/assets/icons/glass/ic-glass-bag.svg" />}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="Barbers"
            total={monthBarber}
            color="secondary"
            icon={<img alt="Barbers" src="/assets/icons/glass/ic-glass-users.svg" />}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="Appointments"
            total={monthAppointment}
            color="error"
            icon={<img alt="Appointments" src="/assets/icons/glass/ic-glass-buy.svg" />}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="Reviews"
            total={monthReview}
            color="warning"
            icon={<img alt="Reviews" src="/assets/icons/glass/ic-glass-message.svg" />}
          />
        </Grid>

        {topBarber && (
          <Grid size={{ xs: 12, lg: 12 }}>
            <Card
              sx={{
                p: 3,
                display: 'flex',
                alignItems: 'center',
                borderRadius: 2,
                boxShadow: 4,
              }}
            >
              <img
                src={topBarber.barberAvatar}
                alt="Top Barber"
                style={{
                  height: '64px',
                  width: '64px',
                  objectFit: 'cover',
                  marginRight: 16,
                  borderRadius: '50%',
                }}
              />
              <div>
                <Typography variant="h6" color="text.primary">
                  🎉 Top Barber of the Month: {topBarber.barberName}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  Total Income: {topBarber.totalIncome.toLocaleString()} đ
                </Typography>
              </div>
            </Card>
          </Grid>
        )}
        <Grid size={{ xs: 12, lg: 12 }}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Income Filter
            </Typography>
            <Grid container spacing={2} alignItems="center">
              <TextField
                select
                label="Year"
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value))}
                fullWidth
              >
                {[2025, 2024, 2023, 2022, 2021].map((y) => (
                  <MenuItem key={y} value={y}>
                    {y}
                  </MenuItem>
                ))}
              </TextField>

              <Button variant="contained" color="primary" onClick={handleFetchChartData} fullWidth>
                Apply
              </Button>
            </Grid>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <AnalyticsWebsiteVisits
            title={`System Income in ${year}`}
            chart={{
              categories: [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec',
              ],
              series: [{ name: 'Income', data: systemRangeIncome }],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <AnalyticsWebsiteVisits
            title={`System Appointment in ${year}`}
            chart={{
              categories: [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec',
              ],
              series: [{ name: 'Appointments', data: systemRangeAppointment }],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 12 }}>
          <AnalyticsWebsiteVisits
            title="System Income in current Year (2025)"
            subheader="Income each month of the year"
            chart={{
              categories: [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec',
              ],
              series: [{ name: 'Income', data: yearIncome }],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 8 }}>
          <AnalyticsConversionRates
            title="Income of Barbers"
            subheader="This month"
            chart={{
              categories: barberIncome.map((b: any) => b.barberName),
              series: [{ name: 'Income', data: barberIncome.map((b: any) => b.totalIncome) }],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <AnalyticsCurrentVisits
            title="Rating Share by Barber"
            chart={{
              series: ratingData.map((r: any) => ({
                label: r.barberName,
                value: r.averageRating,
              })),
            }}
          />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
