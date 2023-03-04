import { useRef, useEffect } from 'react'

// create a hook to get the previous state
export const usePreviousState = <T>(state: T) => {
  const ref = useRef<T>()

  useEffect(() => {
    ref.current = state
  })

  return ref.current
}
