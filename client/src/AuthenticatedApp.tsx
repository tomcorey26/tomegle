import { LoadingSpinner } from '@/components/LoadingSpinner'
import { TheNavbar } from '@/components/TheNavbar'
import { useUser } from '@/hooks/useUser'
import { Suspense, useEffect, useState } from 'react'

import { RouterProvider } from 'react-router-dom'
import { router } from 'router'
import { socket } from '@/socket'

// TODO: Fix Navbar causing overflow

import './App.css'
import { Button } from '@/components/Button'

function AuthenticatedApp() {
  const user = useUser()
  const [connectError, setConnectError] = useState<Error | null>(null)

  useEffect(() => {
    socket.auth = { user }
    socket.connect()

    // hadnle connect_error
    socket.on('connect_error', (err) => {
      setConnectError(err)
    })
  }, [user])

  if (connectError) {
    return (
      <div className="mt-8 flex flex-col items-center justify-center">
        <h1>Connection Error</h1>
        {/* <p>{connectError.message}</p> */}
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    )
  }

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
