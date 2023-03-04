import { useReducer, useEffect } from 'react'
import { socket } from 'socket'

export function useChatMessenger() {
  const [messages, updateMessages] = useReducer(
    (messages: ChatMessage[], newMessage: ChatMessage) => {
      return [...messages, newMessage]
    },
    []
  )

  useEffect(() => {
    socket.on('their-message', (message: ChatMessage) => {
      updateMessages(message)
    })

    return () => {
      socket.off('their-message')
    }
  }, [])

  return { messages, updateMessages }
}
