/* eslint-disable perfectionist/sort-named-imports */
import Cookie from 'js-cookie';

// Import icons từ MUI
import {
  Dashboard,
  Person,
  ShoppingCart,
  Inventory,
  CalendarToday,
  Schedule,
  ReceiptLong,
  RateReview,
  CardGiftcard,
  Redeem,
  LocalOffer,
  Money,
} from '@mui/icons-material';

// ----------------------------------------------------------------------

const userRole = Cookie.get('user_role'); // Lấy userRole từ cookie

export type NavItem = {
  title: string;
  path: string;
  icon: React.ReactNode;
  info?: React.ReactNode;
};

export const navData: NavItem[] = [
  ...(userRole === 'receptionist' || userRole === 'admin'
    ? [
        {
          title: 'Dashboard',
          path: '/',
          icon: <Dashboard />,
        },
      ]
    : []),
  ...(userRole === 'admin'
    ? [
        {
          title: 'Salary',
          path: '/salary',
          icon: <Money />,
        },
        {
          title: 'User',
          path: '/user',
          icon: <Person />,
        },
        {
          title: 'Inventory',
          path: '/inventories',
          icon: <Inventory />,
        },
        {
          title: 'Invoice',
          path: '/invoices',
          icon: <ReceiptLong />,
        },
      ]
    : []),
  ...(userRole === 'receptionist'
    ? [
        {
          title: 'General',
          path: '/general',
          icon: <CalendarToday />,
        },
        {
          title: 'Today',
          path: '/today-schedule',
          icon: <Schedule />,
        },
        {
          title: 'Appointment',
          path: '/appointments',
          icon: <CalendarToday />,
        },
        {
          title: 'Inventory',
          path: '/inventories',
          icon: <Inventory />,
        },
        {
          title: 'Service',
          path: '/services',
          icon: <ShoppingCart />,
        },
        {
          title: 'Invoice',
          path: '/invoices',
          icon: <ReceiptLong />,
        },
        {
          title: 'Discount',
          path: '/discount',
          icon: <LocalOffer />,
        },
      ]
    : []),
  ...(userRole === 'staff'
    ? [
        {
          title: 'Dashboard',
          path: '/baber-dashboard',
          icon: <Dashboard />,
        },
        {
          title: 'Schedule',
          path: '/schedule',
          icon: <Schedule />,
        },
        {
          title: 'Review',
          path: '/review',
          icon: <RateReview />,
        },
      ]
    : []),
  ...(userRole === 'receptionist'
    ? [
        {
          title: 'User',
          path: '/user',
          icon: <Person />,
        },
        {
          title: 'Gift',
          path: '/gift',
          icon: <CardGiftcard />,
        },
        {
          title: 'Redemption',
          path: '/redemption',
          icon: <Redeem />,
        },
      ]
    : []),
];
