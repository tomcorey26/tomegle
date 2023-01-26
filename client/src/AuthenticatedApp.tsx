import { LoadingSpinner } from 'components/LoadingSpinner'
import { TheNavbar } from 'components/TheNavbar'
import { Suspense } from 'react'

import { RouterProvider } from 'react-router-dom'
import { router } from 'router'

// TODO: Fix Navbar causing overflow

import './App.css'

function AuthenticatedApp() {
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
