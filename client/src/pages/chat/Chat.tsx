import { ChatMessenger } from '@/components/ChatMessenger'
import { UserVideo } from '@/pages/chat/components/UserVideo'
import { useEffect, useReducer, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { socket } from 'socket'

// TODO
// Overall features
// - add people as friends from chat
// - create a room that multiple people can join and can be password protected
// Party mode, find random people where 4 people can join a room and talk to each other
// You can leave and vote to kick people out of the room

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

type ChatReducerState = {
  roomId: string
  users: SocketUser[]
  roomMessages: UserMessage[]
}

type ChatReducerAction =
  | {
      type: 'join-room'
      payload: { roomId: string; users: SocketUser[] }
    }
  | {
      type: 'skip-room'
    }
  | {
      type: 'new-message'
      payload: UserMessage
    }

type ChatReducer = (
  state: ChatReducerState,
  action: ChatReducerAction
) => ChatReducerState

const Chat = () => {
  // create a reducer that will handle all the socket events
  // and update the state accordingly.
  // start with the join room event. Add typescript types too
  const [state, dispatch] = useReducer<ChatReducer>(
    (state, action) => {
      switch (action.type) {
        case 'join-room':
          return {
            ...state,
            roomId: action.payload.roomId,
            users: action.payload.users,
            roomMessages: []
          }
        case 'skip-room':
          return {
            ...state,
            roomId: '',
            users: [],
            roomMessages: []
          }
        case 'new-message':
          return {
            ...state,
            roomMessages: [...state.roomMessages, action.payload]
          }
        default:
          return state
      }
    },
    { roomId: '', users: [], roomMessages: [] }
  )

  useEffect(() => {
    socket.emit('joinsert-room')

    socket.on('room-update', (roomId: string, users: SocketUser[]) => {
      dispatch({ type: 'join-room', payload: { roomId, users } })
    })

    socket.on('message', (message: UserMessage) => {
      console.log('new message', message)
      dispatch({ type: 'new-message', payload: message })
    })

    return () => {
      socket.off('room-update')
      socket.off('message')
    }
  }, [])

  const skip = () => {
    socket.emit('skip-room')
  }

  const sendMessage = (message: string) => {
    socket.emit('message', message)
  }

  const isChatDisabled = !state.roomId || state.users.length < 2

  return (
    <div className="grid h-full grid-cols-3 grid-rows-2">
      <div className="col-start-1 self-center">
        <ErrorBoundary
          FallbackComponent={({ error }) => <div>{error.message}</div>}
        >
          {/* <UserVideo /> */}
        </ErrorBoundary>
      </div>
      <div className="col-start-1 row-start-2 self-center">
        <ErrorBoundary
          FallbackComponent={({ error }) => <div>{error.message}</div>}
        >
          {/* <UserVideo /> */}
        </ErrorBoundary>
      </div>

      <div className="col-span-2 row-span-2">
        <p>Room: {state.roomId}</p>
        <p>Users</p>
        {state.users.map((user) => (
          <div key={user.socketId}>{user.socketId}</div>
        ))}
        <button disabled={!state.roomId} onClick={skip}>
          skip
        </button>
        <ChatMessenger
          className="h-full"
          messages={state.roomMessages}
          onMessage={sendMessage}
          disabledForm={isChatDisabled}
        />
      </div>
    </div>
  )
}

export default Chat
