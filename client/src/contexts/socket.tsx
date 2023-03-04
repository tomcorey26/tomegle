import { Button } from '@/components/Button'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { socket } from '@/socket'
import { AnimatePresence, motion } from 'framer-motion'
import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState
} from 'react'
import { Socket } from 'socket.io-client'

export interface SocketState {
  socket: Socket | undefined
  uid: string
}

type SocketReducerAction =
  | {
      type: 'update_socket'
      payload: Socket
    }
  | {
      type: 'update_uid'
      payload: string
    }

export const socketContextReducer = (
  state: SocketState,
  action: SocketReducerAction
): SocketState => {
  switch (action.type) {
    case 'update_socket':
      return {
        ...state,
        socket: action.payload
      }
    case 'update_uid':
      return {
        ...state,
        uid: action.payload
      }
    default:
      throw new Error('Invalid action type')
  }
}

const SocketContext = createContext<
  | { state: SocketState; dispatch: React.Dispatch<SocketReducerAction> }
  | undefined
>(undefined)

type AppConnectionStatus = 'connecting' | 'connected' | 'connect_error'

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(socketContextReducer, {
    socket: undefined,
    uid: ''
  })
  const [connectError, setConnectError] = useState<Error | null>(null)
  const [status, setStatus] = useState<AppConnectionStatus>('connecting')

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      socket.onAny((event, ...args) => {
        console.log(event, args)
      })
    }

    // connect to websocket
    socket.connect()

    // save the socket to state
    dispatch({ type: 'update_socket', payload: socket })

    // start event listeners
    startListeners()

    // send handshake
    sendHandshake()

    return () => {
      socket.disconnect()
      socket.offAny()
    }
  }, [])

  const startListeners = () => {
    socket.io.on('reconnect', (attempt) => {
      console.info('Reconnected on attempt:', attempt)
    })

    socket.io.on('reconnect_attempt', (attempt) => {
      // Todo add UI that tells the user we are reconnecting
      // with the num of attempts
      console.info('Reconnect attempt:', attempt)
    })

    socket.io.on('reconnect_error', (error) => {
      // TODO add a toast for this error
      console.info('Reconnect Error:', error)
    })

    socket.io.on('reconnect_failed', () => {
      console.info('Reconnect Failed')
      setStatus('connect_error')
      setConnectError(new Error('Failed to reconnect to websocket'))
    })
  }

  const sendHandshake = () => {
    socket.emit('handshake', (uid: string) => {
      dispatch({ type: 'update_uid', payload: uid })
      setStatus('connected')
    })
  }

  const connection_error = (
    <div className="mt-8 flex flex-col items-center justify-center">
      <h1>Connection Error</h1>
      {connectError ? <p>{connectError.message}</p> : null}
      <Button onClick={() => window.location.reload()}>Try Again</Button>
    </div>
  )

  const connecting = (
    <div className="flex h-full items-center justify-center">
      <div>
        <h1>Connecting to server</h1>
        <LoadingSpinner size="medium" />
      </div>
    </div>
  )

  const components: Record<AppConnectionStatus, React.ReactNode> = {
    connecting,
    connect_error: connection_error,
    connected: children
  }

  return (
    <SocketContext.Provider value={{ state, dispatch }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={status}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="h-screen"
        >
          {components[status]}
        </motion.div>
      </AnimatePresence>
    </SocketContext.Provider>
  )
}

export const useSocket = () => {
  const context = useContext(SocketContext)

  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider')
  }

  return context
}
