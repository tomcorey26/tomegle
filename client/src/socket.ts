import io, { Socket } from 'socket.io-client'

interface ClientToServerEvents {
  'joinsert-room': () => void
  'skip-room': () => void
  'send-message': (message: string) => void
  handshake: (callback: (user: SocketUser) => void) => void
}

interface ServerToClientEvents {
  'room-update': (roomId: string, users: SocketUser[]) => void
}

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  'http://localhost:8080',
  {
    withCredentials: true,
    autoConnect: false,
    reconnectionAttempts: 5,
    reconnectionDelay: 5000
  }
)
