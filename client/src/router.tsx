import { createBrowserRouter } from 'react-router-dom'

import { Home } from 'pages/home/home'
import { Chat } from 'pages/chat/Chat'
import { ErrorPage } from 'pages/error'
import { FriendChat } from 'pages/friend-chat/FriendChat'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    errorElement: <ErrorPage />
  },
  {
    path: '/friend-chat',
    element: <FriendChat />
  },
  {
    path: '/chat',
    element: <Chat />
  }
])
