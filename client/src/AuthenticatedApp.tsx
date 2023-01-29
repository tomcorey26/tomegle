import { LoadingSpinner } from '@/components/LoadingSpinner'
import { TheNavbar } from '@/components/TheNavbar'
import { useUser } from '@/hooks/useUser'
import { Suspense, useEffect } from 'react'

import { RouterProvider } from 'react-router-dom'
import { router } from 'router'
import { socket } from '@/socket'

// TODO: Fix Navbar causing overflow

import './App.css'

function AuthenticatedApp() {
  const user = useUser()

  useEffect(() => {
    socket.auth = { user }
    socket.connect()
  }, [user])

  return (
    <>
      <header>
        <TheNavbar />
      </header>
      <main>
        <Suspense fallback={<LoadingSpinner />}>
          <RouterProvider router={router} />
        </Suspense>
      </main>
    </>
  )
}

export default AuthenticatedApp
