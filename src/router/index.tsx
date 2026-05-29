import { createBrowserRouter } from 'react-router-dom'
import HomePage from '@/pages/HomePage'
import NotFoundPage from '@/pages/NotFoundPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])

export default router
