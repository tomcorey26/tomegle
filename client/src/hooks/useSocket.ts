import { useRef } from 'react'
import { io } from 'socket.io-client'

export const useSocket = (...args: Parameters<typeof io>) => {
  const socketRef = useRef<ReturnType<typeof io> | null>(null)

  if (!socketRef.current) {
    socketRef.current = io(...args)
  }

  return socketRef.current
}
