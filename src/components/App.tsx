import { useState } from 'react'

import Avatar from 'components/Avatar'
import { TheNavbar } from 'components/TheNavbar'
import { Home } from 'pages/home/home'

type View = 'home' | 'chat'

function App() {
  const [view, setView] = useState<View>('home')

  let component = null
  switch (view) {
    case 'home':
      component = <Home />
      break
    case 'chat':
      // component = <Chat />
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
