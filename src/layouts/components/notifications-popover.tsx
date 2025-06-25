/* eslint-disable perfectionist/sort-imports */
import type { IconButtonProps } from '@mui/material/IconButton';
import Cookie from 'js-cookie';

import { useState, useCallback, useEffect } from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';

import socket from 'src/hooks/useSocker';

import { fToNow } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { deleteAllNotification, getNotifications, markRead } from 'src/redux/apiRequest';
import { useDispatch } from 'react-redux';

// ----------------------------------------------------------------------

type NotificationItemProps = {
  _id: string;
  title: string;
  message: string;
  is_read: boolean;
  createdAt: string | number | null;
};

export type NotificationsPopoverProps = IconButtonProps & {
  data?: NotificationItemProps[];
};

export function NotificationsPopover({ sx, ...other }: NotificationsPopoverProps) {
  const userId = Cookie.get('_id');
  const accessToken = Cookie.get('accessToken');
  const dispatch = useDispatch();
  const [notifications, setNotifications] = useState<any>(null);

  const totalUnRead = notifications?.filter((item: any) => item.is_read === false).length;

  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleMarkAllAsRead = useCallback(async () => {
    const unreadNotifications = notifications?.filter((n: any) => !n.is_read);

    if (unreadNotifications.length === 0) return;

    await Promise.all(unreadNotifications.map((n: any) => markRead(accessToken, n._id, dispatch)));

    const updated = await getNotifications(userId, dispatch);
    setNotifications(updated.metadata);
  }, [notifications, accessToken, userId, dispatch]);

  const handleDeleteNotification = async () => {
    await deleteAllNotification(accessToken, userId, dispatch);
    handleGetNotification();
  };

  const handleGetNotification = async () => {
    const data = await getNotifications(userId, dispatch);
    setNotifications(data.metadata);
  };

  const handleMarkAsRead = async (notificationId: string) => {
    await markRead(accessToken, notificationId, dispatch);
    const updated = await getNotifications(userId, dispatch);
    setNotifications(updated.metadata);
  };

  useEffect(() => {
    handleGetNotification();
    socket.emit('join_room', userId);

    socket.on('new_notification', (newNotification: any) => {
      setNotifications((prev: any) => [newNotification, ...prev]);
    });

    return () => {
      socket.off('new_notification');
    };
  }, []);

  return (
    <>
      <IconButton
        color={openPopover ? 'primary' : 'default'}
        onClick={handleOpenPopover}
        sx={sx}
        {...other}
      >
        <Badge badgeContent={totalUnRead} color="error">
          <Iconify width={24} icon="solar:bell-bing-bold-duotone" />
        </Badge>
      </IconButton>

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: {
              width: 360,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            },
          },
        }}
      >
        <Box
          sx={{
            py: 2,
            pl: 2.5,
            pr: 1.5,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">Notifications</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              You have {totalUnRead} unread messages
            </Typography>
          </Box>

          {totalUnRead > 0 && (
            <Tooltip title=" Mark all as read">
              <IconButton color="primary" onClick={handleMarkAllAsRead}>
                <Iconify icon="eva:done-all-fill" />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Scrollbar fillContent sx={{ minHeight: 240, maxHeight: { xs: 360, sm: 'none' } }}>
          <List
            disablePadding
            subheader={
              <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                New
              </ListSubheader>
            }
          >
            {notifications
              ?.slice(0, 2)
              ?.map((notification: any) => (
                <NotificationItem
                  key={notification._id}
                  notification={notification}
                  onMarkAsRead={handleMarkAsRead}
                />
              ))}
          </List>

          <List
            disablePadding
            subheader={
              <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                Before that
              </ListSubheader>
            }
          >
            {notifications
              ?.slice(2, 5)
              ?.map((notification: any) => (
                <NotificationItem
                  key={notification._id}
                  notification={notification}
                  onMarkAsRead={handleMarkAsRead}
                />
              ))}
          </List>
        </Scrollbar>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Box sx={{ p: 1 }}>
          <Button onClick={handleDeleteNotification} fullWidth disableRipple color="inherit">
            Clear all
          </Button>
        </Box>
      </Popover>
    </>
  );
}

// ----------------------------------------------------------------------
function NotificationItem({
  notification,
  onMarkAsRead,
}: {
  notification: NotificationItemProps;
  onMarkAsRead: (notificationId: string) => void;
}) {
  return (
    <ListItemButton
      sx={{
        py: 1.5,
        px: 2.5,
        mt: '1px',
        ...(!notification.is_read && {
          bgcolor: 'action.selected',
        }),
      }}
    >
      <ListItemAvatar>
        <Avatar
          sx={{ bgcolor: 'background.neutral' }}
          src={
            notification.title === 'Appointment Confirmed as Completed'
              ? 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTp9zCTxTTeD55Fa45aBsTOmGYMSoKLr86kCQ&s'
              : notification.title === 'Haircut Canceled!'
                ? 'https://img.icons8.com/color/512/cancel.png'
                : notification.title === 'New Appointment' || notification.title === 'New Schedule'
                  ? 'https://cdn-icons-png.flaticon.com/512/10786/10786066.png'
                  : notification.title === 'Haircut Complete'
                    ? 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6nOI0usYypR7m6rWTeQuhZ39rtmiS5aTsDw&s'
                    : 'https://cdn-icons-png.flaticon.com/512/5978/5978100.png'
          }
        />
      </ListItemAvatar>

      <ListItemText
        primary={renderContent(notification).title}
        secondary={
          <Typography
            variant="caption"
            sx={{
              mt: 0.5,
              gap: 0.5,
              display: 'flex',
              alignItems: 'center',
              color: 'text.disabled',
            }}
          >
            <Iconify width={14} icon="solar:clock-circle-outline" />
            {fToNow(notification.createdAt)}
          </Typography>
        }
      />

      {!notification.is_read && (
        <Tooltip title="Mark as read">
          <IconButton size="small" onClick={() => onMarkAsRead(notification._id)}>
            <Iconify icon="solar:check-circle-bold" />
          </IconButton>
        </Tooltip>
      )}
    </ListItemButton>
  );
}

// ----------------------------------------------------------------------

function renderContent(notification: NotificationItemProps) {
  const title = (
    <Typography variant="subtitle2">
      {notification.title}
      <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
        &nbsp; {notification.message}
      </Typography>
    </Typography>
  );
  return {
    avatarUrl: notification.title ? (
      <img alt={notification.title} src={notification.title} />
    ) : null,
    title,
  };
}
