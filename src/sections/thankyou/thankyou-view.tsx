/* eslint-disable perfectionist/sort-imports */
import Rating from '@mui/material/Rating';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import Cookie from 'js-cookie';
import {
  createInvoice,
  createReview,
  getAllDiscounts,
  getAppointment,
  getUserDiscounts,
  updateAccumulatePoint,
} from 'src/redux/apiRequest';
import { toast } from 'react-toastify';
import { Box, Button, Container, Typography } from '@mui/material';
import { Logo } from 'src/components/logo';
import { RouterLink } from 'src/routes/components';

export function ThankYouView() {
  const { id, amount, method } = useParams();
  const dispatch = useDispatch();
  const accessToken = Cookie.get('accessToken');

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hasRated, setHasRated] = useState(false);
  const [appointment, setAppointment] = useState<any>({});

  const handleGetAppointment = async () => {
    const data = await getAppointment(id, dispatch);
    if (data.metadata?.customer) {
      const res = await updateAccumulatePoint(
        accessToken,
        data.metadata?.customer,
        Math.floor(Number(amount) / 1000),
        dispatch
      );
    }
    setAppointment(data.metadata);
  };

  const handleCreateInvoice = async () => {
    const data = await createInvoice(
      accessToken,
      { appointment_id: id, total_amount: amount, payment_method: method },
      dispatch
    );
    if (data) {
      toast.success('Create invoice successfully.');
    }
  };

  const handleSubmitRating = async () => {
    if (rating > 0) {
      try {
        await createReview(
          accessToken,
          {
            customer: appointment?.customer_name,
            barber: appointment?.barber,
            service: appointment?.service,
            rating,
            comment,
          },
          dispatch
        );

        toast.success('Thanks for your feedback!');
        setHasRated(true);
      } catch (error) {
        toast.error('Oops! Something went wrong.');
      }
    } else {
      toast.warning('Please select a rating before submitting.');
    }
  };

  useEffect(() => {
    handleCreateInvoice();
    handleGetAppointment();
  }, []);

  return (
    <>
      <Logo sx={{ position: 'fixed', top: 20, left: 20 }} />

      <Container
        sx={{
          py: 10,
          flexGrow: 1,
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        <Typography variant="h3" sx={{ mb: 2 }}>
          Thank you for your payment!
        </Typography>

        <Typography sx={{ color: 'text.secondary', maxWidth: 520 }}>
          We appreciate your trust in our service. Your appointment has been successfully confirmed.
          We look forward to serving you soon!
        </Typography>

        <Box
          component="img"
          src="https://static.vecteezy.com/system/resources/previews/015/235/166/non_2x/thank-you-text-button-thank-you-sign-icon-label-sticker-web-buttons-vector.jpg"
          alt="Thank you illustration"
          sx={{
            width: 320,
            height: 'auto',
            my: { xs: 5, sm: 8 },
          }}
        />

        {!hasRated && (
          <Box sx={{ mb: 4, maxWidth: 500, width: '100%' }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              How was your experience?
            </Typography>

            <Rating
              name="barber-rating"
              value={rating}
              onChange={(_, newValue: any) => setRating(newValue)}
              size="large"
            />

            <TextField
              multiline
              minRows={3}
              fullWidth
              label="Leave a comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              sx={{ mt: 2 }}
            />

            <Box sx={{ mt: 2 }}>
              <Button variant="outlined" onClick={handleSubmitRating}>
                Submit Feedback
              </Button>
            </Box>
          </Box>
        )}

        {hasRated && (
          <Typography sx={{ mt: 2, color: 'success.main' }}>
            You rated us {rating} star{rating > 1 ? 's' : ''}. Thanks for your feedback!
          </Typography>
        )}

        <Button
          component={RouterLink}
          href="/"
          size="large"
          variant="contained"
          color="primary"
          sx={{ mt: 4 }}
        >
          Back to home
        </Button>
      </Container>
    </>
  );
}
