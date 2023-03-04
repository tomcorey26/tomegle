import { createRoot } from 'react-dom/client'
import 'tailwindcss/tailwind.css'
import App from '@/App'
import { SocketProvider } from '@/contexts/socket'

const container = document.getElementById('root') as HTMLDivElement
const root = createRoot(container)

root.render(
  <SocketProvider>
    <App />
  </SocketProvider>
)
