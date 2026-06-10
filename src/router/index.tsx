import { createBrowserRouter, Navigate } from 'react-router-dom'
import NotFoundPage from '@/pages/NotFoundPage'
import AdminPage from '@/pages/AdminPage'
import LoginPage from '@/pages/LoginPage'
import { RequireAdmin } from '@/features/auth/RequireAdmin'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/admin" replace />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/admin',
    element: (
      <RequireAdmin>
        <AdminPage />
      </RequireAdmin>
    ),
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])

export default router
