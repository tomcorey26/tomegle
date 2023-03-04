import io, { Socket } from 'socket.io-client'

interface ClientToServerEvents {
  'joinsert-room': (callback: (roomId: string) => void) => void
  'leave-room': (roomId: string) => void
  'send-message': (message: string) => void
  handshake: (callback: (user: SocketUser) => void) => void
}

export const socket: Socket<any, ClientToServerEvents> = io(
  'http://localhost:8080',
  {
    withCredentials: true,
    autoConnect: false,
    reconnectionAttempts: 5,
    reconnectionDelay: 5000
  }
)
