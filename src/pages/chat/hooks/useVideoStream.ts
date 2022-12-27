import { useRef, useEffect } from 'react'

export function useVideoStream(stream?: MediaStream) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    async function requestPermissions() {
      const userStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      })

      if (!videoRef.current) throw new Error('Video ref is not defined')

      videoRef.current.srcObject = userStream
    }

    if (stream) {
      videoRef.current!.srcObject = stream
    } else {
      requestPermissions()
    }
  }, [stream])

  return videoRef
}
