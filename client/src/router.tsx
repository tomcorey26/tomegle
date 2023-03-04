import { createBrowserRouter } from 'react-router-dom'

import { Home } from '@/pages/home/home'
import { lazy } from 'react'

// Convert this to a dynamic import
const Chat = lazy(() => import('@/pages/chat/Chat'))
const ErrorPage = lazy(() => import('@/pages/error'))
const FriendChat = lazy(() => import('@/pages/friend-chat/FriendChat'))

// TODO use loaders to load data for the pages
// TODO use error pages
// TODO use suspense
// use App layout outlet

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    errorElement: <ErrorPage />
  },
  {
    path: '/friend-chat',
    element: <FriendChat />,
    errorElement: <ErrorPage />
  },
  {
    path: '/chat',
    element: <Chat />
  }
])
