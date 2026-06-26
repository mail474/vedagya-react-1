import { createBrowserRouter, Navigate } from 'react-router-dom'
import NotFoundPage from '@/pages/NotFoundPage'
import AdminPage from '@/pages/AdminPage'
import LoginPage from '@/pages/LoginPage'
import TermsConditionPage from '@/pages/TermsConditionPage'
import RefundPolicyPage from '@/pages/RefundPolicyPage'
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
    path: '/terms-condition',
    element: <TermsConditionPage />,
  },
  {
    path: '/refund-policy',
    element: <RefundPolicyPage />,
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
