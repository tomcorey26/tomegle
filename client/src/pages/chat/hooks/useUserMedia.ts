import { useRef, useEffect, useState } from 'react'

type MediaStatus = 'idle' | 'requesting-access' | 'streaming' | 'error'
export function useUserMedia() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [status, setStatus] = useState<MediaStatus>('idle')

  async function requestPermissions() {
    setStatus('requesting-access')

    const userStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    })

    if (!videoRef.current) throw new Error('Video ref is not defined')

    videoRef.current.srcObject = userStream

    setStatus('streaming')
  }

  useEffect(() => {
    requestPermissions()
  }, [])

  return { videoRef, status, requestPermissions }
}
