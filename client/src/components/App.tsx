import { useState } from 'react'

import { TheNavbar } from 'components/TheNavbar'

import { RouterProvider } from 'react-router-dom'
import { router } from 'router'

// TODO: Fix Navbar causing overflow

function App() {
  return (
    <>
      {/* <TheNavbar /> */}
      <RouterProvider router={router} />
      {/* {component} */}
    </>
  )
}

export default App
