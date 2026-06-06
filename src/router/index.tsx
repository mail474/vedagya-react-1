import { createBrowserRouter } from 'react-router-dom'
// import HomePage from '@/pages/HomePage'
import NotFoundPage from '@/pages/NotFoundPage'
import AdminPage from '@/pages/AdminPage'

const router = createBrowserRouter([
  // {
  //   path: '/',
  //   element: <HomePage />,
  // },
  {
    path: '/',
    element: <AdminPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])

export default router
