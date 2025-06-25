/* eslint-disable perfectionist/sort-imports */
import { useState, useEffect } from 'react';
import { Box, Button, Typography, Card, Stack, Avatar, Divider } from '@mui/material';
import { redirect, useParams } from 'react-router-dom';
import Cookie from 'js-cookie';
import { useDispatch } from 'react-redux';

import { DashboardContent } from 'src/layouts/dashboard';
import { applyDiscount, getAppointment, getUserDiscounts } from 'src/redux/apiRequest';
import { QRCodeSVG } from 'qrcode.react';

export function PaymentView() {
  const accessToken = Cookie.get('accessToken');
  const { id } = useParams();
  const dispatch = useDispatch();
  const [appointment, setAppointment] = useState<any>(null);
  const [method, setMethod] = useState<'cash' | 'momo' | null>(null);
  const [payUrl, setPayUrl] = useState<string | null>(null);
  const [payQr, setPayQr] = useState<string>('');
  const [discount, setDiscount] = useState<any>({});
  const [selectedDiscount, setSelectedDiscount] = useState<any>(null);
  const [finalPrice, setFinalPrice] = useState<any>(0);
  const [discountPrice, setDiscountPrice] = useState<any>(0);
  const [totalPrice, setTotalPrice] = useState(0);

  const handleGetAppointment = async () => {
    const data = await getAppointment(id, dispatch, true);
    const usableDiscount = await getUserDiscounts(data.metadata?.customer, dispatch);
    setAppointment(data.metadata);
    setDiscount(usableDiscount?.data?.metadata);
  };

  const handleMomoPayment = async () => {
    try {
      await applyDiscount(
        accessToken,
        {
          code: selectedDiscount?.code,
          user_id: appointment?.customer,
        },
        dispatch
      );
      const res = await fetch(`${import.meta.env.VITE_REACT_APP_BASE_URL}payment/momo`, {
        method: 'POST',
        body: JSON.stringify({
          amount: finalPrice.toString(),
          redirectUrl: `${import.meta.env.VITE_REACT_APP_DASHBOARD_URL}thankyou/${appointment._id}/${finalPrice}/momo`,
          orderInfo: `Thanh toán hóa đơn của ${appointment.user_name}`,
        }),
        headers: {
          'Content-Type': 'application/json',
          authorization: accessToken,
        },
      });

      const result = await res.json();
      console.log('result', result);

      if (result) {
        setPayUrl(result.link);
        setPayQr(result.qr);
      }
    } catch (err) {
      alert('Có lỗi xảy ra khi thanh toán Momo');
      console.error(err);
    }
  };
  useEffect(() => {
    handleGetAppointment();
  }, []);

  useEffect(() => {
    if (!appointment) return;

    const total = appointment.service.reduce((acc: number, s: any) => acc + s.service_price, 0);
    setTotalPrice(total);
    setFinalPrice(total);
  }, [appointment]);

  if (!appointment) return <DashboardContent>Đang tải dữ liệu...</DashboardContent>;

  return (
    <DashboardContent>
      <Card sx={{ p: 3, mx: 'auto', minWidth: '800px' }}>
        <Typography variant="h5" gutterBottom>
          Thanh toán
        </Typography>

        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Avatar src={appointment.barber?.user_avatar} />
          <Box>
            <Typography fontWeight="bold">{appointment.customer_name}</Typography>
            <Typography fontSize="0.875rem" color="text.secondary">
              Thợ: {appointment.barber?.user_name}
            </Typography>
          </Box>
        </Stack>

        <Divider sx={{ my: 2 }} />

        {appointment.service.map((s: any) => (
          <Box key={s._id} sx={{ mb: 1 }}>
            <Typography>{s.service_name}</Typography>
            <Typography fontSize="0.875rem" color="text.secondary">
              {s.service_price.toLocaleString('vi-VN')}đ
            </Typography>
          </Box>
        ))}

        <Divider sx={{ my: 2 }} />

        <Typography fontWeight="bold">Tổng cộng: {totalPrice.toLocaleString('vi-VN')}đ</Typography>
        <Typography mt={2} fontWeight="bold">
          Các mã giảm giá
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: 'repeat(auto-fill, minmax(500px, 1fr))',
          }}
        >
          {appointment?.customer &&
            discount.map((d: any) => (
              <Card
                key={d._id}
                sx={{
                  p: 2,
                  display: 'grid',
                  gridTemplateColumns: 'repeat(5, 1fr) auto',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <Typography fontWeight="bold">{d.code}</Typography>
                <Typography color="primary">
                  {d.percentage ? `${d.percentage}%` : `${d.amount.toLocaleString('vi-VN')}đ`}
                </Typography>
                <Typography fontSize="0.875rem">
                  {new Date(d.start_date).toLocaleDateString('vi-VN')}
                </Typography>
                <Typography fontSize="0.875rem">
                  {new Date(d.end_date).toLocaleDateString('vi-VN')}
                </Typography>
                <Typography fontSize="0.875rem">
                  {d.assigned_user
                    ? `Áp dụng riêng, còn ${d.usage_limit - d.used_count} lần`
                    : 'Áp dụng cho tất cả'}
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => {
                    const newPrice = appointment.service.reduce(
                      (acc: number, s: any) => acc + s.service_price,
                      0
                    );
                    const discountAmount = d.percentage
                      ? Math.floor((newPrice * d.percentage) / 100)
                      : d.amount;

                    setDiscountPrice(discountAmount);
                    setFinalPrice(newPrice - discountAmount);
                    setSelectedDiscount(d);
                  }}
                >
                  {selectedDiscount?._id === d._id ? 'Đã chọn' : 'Chọn'}
                </Button>
              </Card>
            ))}
          {!appointment?.customer && (
            <Typography fontSize="0.875rem" color="text.secondary">
              Không áp dụng mã giảm giá cho người dùng không đăng ký tài khoản
            </Typography>
          )}
        </Box>

        <Typography mt={1}>Giảm giá: {discountPrice.toLocaleString('vi-VN')}đ</Typography>
        <Typography fontWeight="bold">Giá cuối: {finalPrice.toLocaleString('vi-VN')}đ</Typography>

        <Box sx={{ mt: 3 }}>
          <Typography fontWeight="medium" sx={{ mb: 1 }}>
            Chọn phương thức thanh toán:
          </Typography>

          <Stack direction="row" spacing={2}>
            <Button
              variant={method === 'cash' ? 'contained' : 'outlined'}
              onClick={() => setMethod('cash')}
            >
              Tiền mặt
            </Button>

            <Button
              variant={method === 'momo' ? 'contained' : 'outlined'}
              onClick={() => setMethod('momo')}
            >
              Momo
            </Button>
          </Stack>

          {method === 'cash' && (
            <Button
              fullWidth
              variant="contained"
              color="success"
              sx={{ mt: 3 }}
              onClick={async () => {
                await applyDiscount(
                  accessToken,
                  {
                    code: selectedDiscount?.code,
                    user_id: appointment?.customer,
                  },
                  dispatch
                );
                const url = `${import.meta.env.VITE_REACT_APP_DASHBOARD_URL}thankyou/${appointment._id}/${finalPrice}/cash`;
                window.location.href = url;
              }}
            >
              Xác nhận thanh toán
            </Button>
          )}

          {method === 'momo' && payUrl && (
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography fontWeight="medium" sx={{ mb: 1 }}>
                Quét mã để thanh toán:
              </Typography>
              <QRCodeSVG value={payQr} size={200} />
              <Typography variant="body2" sx={{ mt: 1 }}>
                Hoặc nhấn vào{' '}
                <a
                  href={payUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#1976d2' }}
                >
                  liên kết này
                </a>
              </Typography>
            </Box>
          )}

          {method === 'momo' && (
            <Button
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3 }}
              onClick={handleMomoPayment}
            >
              Thanh toán qua Momo
            </Button>
          )}
        </Box>
      </Card>
    </DashboardContent>
  );
}
