import Cookies from 'js-cookie';

import type { WorkspacesPopoverProps } from './components/workspaces-popover';

// ----------------------------------------------------------------------

export const _workspaces: WorkspacesPopoverProps['data'] = [
  {
    id: 'Role',
    name: Cookies.get('user_name'),
    role: Cookies.get('user_role'),
    logo: Cookies.get('user_avatar'),
  },
];
