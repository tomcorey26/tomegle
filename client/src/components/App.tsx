import { useState } from 'react'

import { TheNavbar } from 'components/TheNavbar'

import { RouterProvider } from 'react-router-dom'
import { router } from 'router'

// TODO: Fix Navbar causing overflow

import '../App.css'

function App() {
  return (
    <>
      <header>
        <TheNavbar />
      </header>
      <main>
        <RouterProvider router={router} />
      </main>
    </>
  )
}

export default App
