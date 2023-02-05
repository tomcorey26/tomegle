import { useChatMessenger } from '@/hooks/useChatMessenger'
import { ChatMessenger } from '@/components/ChatMessenger'
import { UserVideo } from '@/pages/chat/components/UserVideo'
import { useEffect, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { socket } from 'socket'

// TODO
// Overall features
// - add people as friends from chat
// - create a room that multiple people can join and can be password protected

// Chat Messenger
// - Move the message metadata outside of the message
// - send messages with web sockets
// - Add ability to send photos and gifs
// - add animation upon new message
// - Add ability to react to messages
// - add emoji picker
// - achievements, badges, etc
// dark mode
// color theme mode
//  - first message
//  - first reaction
//  - first emoji
//  - sent over 100 messages
//  - sent over 1000 messages
//  -talked to someone for 1 hour
//  - talked to someone for 10 hours
//  - talked to someone for 24 hours

// use machine learning to detect if someone is doing something inappropriate
// and insta ban them
// make it so that you dont have to make an account
// to friend someone and chat with them, and call them directly

const Chat = () => {
  const [isConnected, setIsConnected] = useState(socket.connected)
  const [lastPong, setLastPong] = useState<string | null>(null)

  const { messages, updateMessages } = useChatMessenger()

  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true)
    })

    socket.on('disconnect', () => {
      setIsConnected(false)
    })

    socket.on('pong', () => {
      setLastPong(new Date().toISOString())
    })

    return () => {
      socket.off('connect')
      socket.off('disconnect')
      socket.off('pong')
    }
  }, [])

  const sendPing = () => {
    socket.emit('ping')
  }

  return (
    <div className="grid h-full grid-cols-3 grid-rows-2">
      <div className="col-start-1 self-center">
        <ErrorBoundary
          FallbackComponent={({ error }) => <div>{error.message}</div>}
        >
          <button onClick={sendPing}>Send ping</button>
          <UserVideo />
        </ErrorBoundary>
      </div>
      <div className="col-start-1 row-start-2 self-center">
        <ErrorBoundary
          FallbackComponent={({ error }) => <div>{error.message}</div>}
        >
          <UserVideo />
        </ErrorBoundary>
      </div>

      <div className="col-span-2 row-span-2">
        <ChatMessenger
          className="h-full"
          messages={messages}
          updateMessages={updateMessages}
        />
      </div>
    </div>
  )
}

export default Chat
