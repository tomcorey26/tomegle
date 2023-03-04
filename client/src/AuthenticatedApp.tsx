import { LoadingSpinner } from '@/components/LoadingSpinner'
import { TheNavbar } from '@/components/TheNavbar'
import { Suspense } from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from 'router'

import './App.css'

function AuthenticatedApp() {
  return (
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
}

export default AuthenticatedApp
