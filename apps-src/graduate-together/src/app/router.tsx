import { Navigate, createBrowserRouter } from 'react-router-dom'
import { AppShell } from './AppShell'
import { GamePage } from '../pages/GamePage'
import { HomePage } from '../pages/HomePage'

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <AppShell />,
      children: [
        {
          index: true,
          element: <HomePage />,
        },
        {
          path: 'setup',
          element: <Navigate replace to="/" />,
        },
        {
          path: 'game',
          element: <GamePage />,
        },
        {
          path: 'how-to-play',
          element: <Navigate replace to="/" />,
        },
        {
          path: 'accessibility',
          element: <Navigate replace to="/" />,
        },
        {
          path: 'summary',
          element: <Navigate replace to="/game" />,
        },
      ],
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
  },
)
