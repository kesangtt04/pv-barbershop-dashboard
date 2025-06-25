/* eslint-disable perfectionist/sort-imports */
import Cookie from 'js-cookie';
import { StrictMode } from 'react';
import { Provider } from 'react-redux';
import { createRoot } from 'react-dom/client';
import { PersistGate } from 'redux-persist/integration/react';
import { Outlet, RouterProvider, createBrowserRouter, redirect } from 'react-router';

import App from './app';
import { store, persistor } from './redux/store';
import { routesSection } from './routes/sections';
import { ErrorBoundary } from './routes/components';

// ----------------------------------------------------------------------

const router = createBrowserRouter([
  {
    Component: () => (
      <App>
        <Outlet />
      </App>
    ),
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: '/',
        element: <Outlet />,
        children: [...routesSection],
      },
    ],
  },
]);

const root = createRoot(document.getElementById('root')!);

// Lấy query string từ URL
const params = new URLSearchParams(window.location.search);

// Nếu có accessToken trong URL, coi như là redirect từ trang đăng nhập
if (params.has('accessToken') && params.has('refreshToken')) {
  // Duyệt qua toàn bộ params và lưu vào cookie
  params.forEach((value, key) => {
    Cookie.set(key, value, { expires: 7 }); // Set cookie 7 ngày
  });

  // Optional: Xóa query params khỏi URL để gọn gàng
  const newUrl = window.location.origin + window.location.pathname;
  window.history.replaceState({}, document.title, newUrl);
}

root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <RouterProvider router={router} />
    </PersistGate>
  </Provider>
);
