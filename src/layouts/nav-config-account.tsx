import Cookie from 'js-cookie';

import { Iconify } from 'src/components/iconify';

import type { AccountPopoverProps } from './components/account-popover';

// ----------------------------------------------------------------------

export const _account: AccountPopoverProps['data'] = [
  {
    new: false,
    label: 'Home',
    href: '/',
    icon: <Iconify width={22} icon="solar:home-angle-bold-duotone" />,
  },
  {
    new: true,
    label: 'Profile',
    href: `${import.meta.env.VITE_USER_BASE_URL}account/${Cookie.get("_id")}`,
    icon: <Iconify width={22} icon="solar:shield-keyhole-bold-duotone" />,
  },
];
