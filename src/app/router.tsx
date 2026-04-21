import { Navigate, Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom';

import { LoginPage } from '../features/auth/pages/login-page';
import { RegisterPage } from '../features/auth/pages/register-page';
import { TasksPage } from '../features/tasks/pages/tasks-page';
import { useAuthStore } from '../store/auth-store';

function PrivateRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

function PublicRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/tasks" replace />;
  }

  return <Outlet />;
}

const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/cadastro',
        element: <RegisterPage />,
      },
    ],
  },
  {
    element: <PrivateRoute />,
    children: [
      {
        path: '/tasks',
        element: <TasksPage />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/tasks" replace />,
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
