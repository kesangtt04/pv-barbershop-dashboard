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
  getIncomeOfBarberInMonth,
  getIncomeOfBarberInYear,
  getIncomeOfBarbersInMonth,
  getIncomeOfSystemInYear,
  getRatingOfBarber,
  getRatingsOfBarber,
} from 'src/redux/apiRequest';
import { useDispatch } from 'react-redux';
import { Button, MenuItem, TextField } from '@mui/material';
import Cookie from "js-cookie";

// ----------------------------------------------------------------------

export function OverviewAnalyticsView() {
  const userID = Cookie.get("_id");
  const [barberIncome, setBarberIncome] = useState([]);
  const [ratingInfo, setRatingInfo] = useState({ averageRating: 0, totalReview: 0 });
  const [year, setYear] = useState(new Date().getFullYear());
  const [systemRangeAppointment, setSystemRangeAppointment] = useState<any[]>([]);
  const [systemRangeIncome, setSystemRangeIncome] = useState<number[]>([]);
  const [monthIncome, setMonthIncome] = useState(0);
  const [monthAppointment, setMonthAppointment] = useState(0);
  const [monthReview, setMonthReview] = useState(0);
  const [monthBarber, setMonthBarber] = useState(0);

  const handleGetRating = async () => {
    const res = await getRatingOfBarber(userID, dispatch);
    console.log("my rating", res);
    if (res?.metadata) setRatingInfo(res.metadata);
  };
  
  const handleGetIncome = async () => {
    const res = await getIncomeOfBarberInMonth(userID, dispatch);
    console.log("my income", res);
    if (res?.metadata) setBarberIncome(res.metadata);
  };

  const dispatch = useDispatch();
  const [yearIncome, setYearIncome] = useState<number[]>([]);

  const handleFetchChartData = async () => {
    const response = await getIncomeOfBarberInYear(userID, year, dispatch);
    console.log("chart data", response);
    if (response?.metadata) {
      const income = response.metadata.map((item: any) => item.totalIncome);
      setYearIncome(income);
    }
  };

  useEffect(() => {
    handleFetchChartData();
    handleGetRating();
    handleGetIncome();
  }, []);

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        Hi, Welcome back 👋
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 12, md: 12 }}>
          <Card
            sx={{
              p: 3,
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'center',
              bgcolor: 'background.paper',
              borderRadius: 2,
              boxShadow: 3,
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <img src="/assets/icons/glass/ic-glass-bag.svg" alt="Income" width={40} style={{ marginBottom: 8 }} />
              <Typography variant="subtitle1">This Month&apos;s Income</Typography>
              <Typography variant="h5" color="primary">
                ${barberIncome}
              </Typography>
            </div>

            <div style={{ textAlign: 'center' }}>
              <img src="/assets/icons/glass/ic-glass-star.svg" alt="Rating" width={40} style={{ marginBottom: 8 }} />
              <Typography variant="subtitle1">Average Rating</Typography>
              <Typography variant="h5" color="warning.main">
                ⭐ {ratingInfo.averageRating.toFixed(1)} / 5
              </Typography>
            </div>

            <div style={{ textAlign: 'center' }}>
              <img src="/assets/icons/glass/ic-glass-message.svg" alt="Reviews" width={40} style={{ marginBottom: 8 }} />
              <Typography variant="subtitle1">Total Reviews</Typography>
              <Typography variant="h5" color="text.secondary">
                📝 {ratingInfo.totalReview}
              </Typography>
            </div>
          </Card>
        </Grid>

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

        <Grid size={{ xs: 12, md: 12, lg: 12 }}>
          <AnalyticsWebsiteVisits
            title="My Income in current Year (2025)"
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
      </Grid>
    </DashboardContent>
  );
}
