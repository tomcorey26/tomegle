import { useReducer, useEffect } from 'react'
import { socket } from 'socket'

export type Message = {
  text: string
  sender: 'me' | 'them'
  id: string
  date: string
}

export function useChatMessenger() {
  const [messages, updateMessages] = useReducer(
    (messages: Message[], newMessage: Message) => {
      return [...messages, newMessage]
    },
    []
  )

  useEffect(() => {
    socket.on('their-message', (message: Message) => {
      updateMessages(message)
    })

    return () => {
      socket.off('their-message')
    }
  }, [])

  return { messages, updateMessages }
}
