import { LoadingSpinner } from '@/components/LoadingSpinner'
import { TheNavbar } from '@/components/TheNavbar'
import { useUser } from '@/hooks/useUser'
import { Button } from '@/components/Button'
import { AnimatePresence, motion } from 'framer-motion'
import React, { Suspense, useEffect, useState } from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from 'router'
import { socket } from '@/socket'

import './App.css'

type AppConnectionStatus = 'connecting' | 'connected' | 'connect_error'

function AuthenticatedApp() {
  const user = useUser()

  const [connectError, setConnectError] = useState<Error | null>(null)
  const [status, setStatus] = useState<AppConnectionStatus>('connecting')

  useEffect(() => {
    socket.auth = { user }
    socket.connect()

    if (process.env.NODE_ENV === 'development') {
      socket.onAny((event, ...args) => {
        console.log(event, args)
      })
    }

    // hadnle connect_error
    socket.on('connect_error', (err) => {
      setConnectError(err)
      setStatus('connect_error')
    })

    socket.on('connect', () => {
      setTimeout(() => {
        setStatus('connected')
      }, 1000)
    })

    return () => {
      socket.disconnect()
      socket.offAny()
    }
  }, [user])

  const connection_error = (
    <div className="mt-8 flex flex-col items-center justify-center">
      <h1>Connection Error</h1>
      {connectError ? <p>{connectError.message}</p> : null}
      <Button onClick={() => window.location.reload()}>Try Again</Button>
    </div>
  )

  const connecting = (
    <div className="flex h-full items-center justify-center">
      <LoadingSpinner size="large" />
    </div>
  )

  const connected = (
    <div className="grid h-screen" style={{ gridTemplateRows: 'auto 1fr' }}>
      <header>
        <TheNavbar />
      </header>
      <main>
        <Suspense
          fallback={
            <div className="flex h-full items-center justify-center">
              <LoadingSpinner />
            </div>
          }
        >
          <RouterProvider router={router} />
        </Suspense>
      </main>
    </div>
  )

  const components: Record<AppConnectionStatus, React.ReactNode> = {
    connecting,
    connected,
    connect_error: connection_error
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={status}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className="h-screen"
      >
        {components[status]}
      </motion.div>
    </AnimatePresence>
  )
}

export default AuthenticatedApp
