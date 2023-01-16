import { createBrowserRouter } from 'react-router-dom'

import { Home } from 'pages/home/home'
import { Chat } from 'pages/chat/Chat'
import { ErrorPage } from 'pages/error'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    errorElement: <ErrorPage />
  },
  {
    path: '/chat',
    element: <Chat />
  }
])
