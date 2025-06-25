/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable perfectionist/sort-imports */
import { useState, useCallback } from 'react';

import { Button } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import { Label } from 'src/components/label';
import Box from '@mui/material/Box';
import Cookie from 'js-cookie';
// ----------------------------------------------------------------------

export type UserProps = {
  _id: string;
  user_name: string;
  user_email: string;
  user_avatar?: string;
  user_role?: string;
  user_gender?: string;
  user_password?: string;
};

type UserTableRowProps = {
  row: UserProps;
  selected: boolean;
  onSelectRow: () => void;
  onDelete: (user: UserProps) => void;
};

export function UserTableRow({ row, selected, onSelectRow, onDelete }: UserTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  return (
    <>
      <TableRow hover tabIndex={-1} selected={selected}>
        <TableCell component="th" scope="row">
          <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
            <Avatar alt={row.user_name} src={row.user_avatar || undefined} />
            {row.user_name}
          </Box>
        </TableCell>

        <TableCell>{row.user_email}</TableCell>

        <TableCell>{row.user_gender || '-'}</TableCell>

        <TableCell>{row.user_role || '-'}</TableCell>

        {/* <TableCell align="center">{row.isAdmin ? '✔️' : '-'}</TableCell> */}

        <TableCell>
          <Label color="success">Active</Label>
        </TableCell>

        <TableCell>
          <Button
            onClick={() => {
              handleClosePopover();
              onDelete(row);
            }}
            variant="contained"
            color="error"
            disabled={Cookie.get('user_role') !== 'admin'}
          >
            Delete
          </Button>
        </TableCell>
      </TableRow>
    </>
  );
}
