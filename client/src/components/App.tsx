import { useState } from 'react'

import { TheNavbar } from 'components/TheNavbar'
import { Home } from 'pages/home/home'
import { Chat } from 'pages/chat/Chat'

type View = 'home' | 'chat'

function App() {
  const [view, setView] = useState<View>('chat')

  let component = null
  switch (view) {
    case 'home':
      component = <Home />
      break
    case 'chat':
      component = <Chat />
      break
  }

  return (
    <div className="bg-white">
      <TheNavbar />
      <div>{component}</div>
    </div>
  )
}

export default App
