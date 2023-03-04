import './App.css'

import { useUser } from '@/hooks/useUser'
import { lazy } from 'react'

const AuthenticatedApp = lazy(() => import('@/AuthenticatedApp'))
const UnAuthenticatedApp = lazy(() => import('@/UnAuthenticatedApp'))

function App() {
  const user = useUser()

  return user ? <AuthenticatedApp /> : <UnAuthenticatedApp />
}

export default App
